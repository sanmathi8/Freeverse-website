package dev.freeverse.service;

import dev.freeverse.dto.ConversationResponse;
import dev.freeverse.dto.MessageRequest;
import dev.freeverse.dto.MessageResponse;
import dev.freeverse.entity.Conversation;
import dev.freeverse.entity.Message;
import dev.freeverse.entity.Profile;
import dev.freeverse.entity.User;
import dev.freeverse.exception.BadRequestException;
import dev.freeverse.exception.ResourceNotFoundException;
import dev.freeverse.exception.UnauthorizedException;
import dev.freeverse.repository.ConversationRepository;
import dev.freeverse.repository.MessageRepository;
import dev.freeverse.repository.ProfileRepository;
import dev.freeverse.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessagingService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ProfileService profileService;

    public MessagingService(
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            UserRepository userRepository,
            ProfileRepository profileRepository,
            ProfileService profileService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.profileService = profileService;
    }

    @Transactional(readOnly = true)
    public List<ConversationResponse> getUserConversations(String currentUserId) {
        List<Conversation> conversations = conversationRepository.findByUserId(currentUserId);
        return conversations.stream()
                .map(c -> mapToConversationResponse(c, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ConversationResponse getConversationById(String conversationId, String currentUserId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        verifyMembership(conversation, currentUserId);
        return mapToConversationResponse(conversation, currentUserId);
    }

    @Transactional
    public MessageResponse sendMessage(String currentUserId, MessageRequest request) {
        User sender = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender user not found"));

        Conversation conversation;

        // Check if recipient is passed as a recipientUserId or existing conversationId
        Optional<Conversation> existingConv = conversationRepository.findById(request.getRecipientUserId());

        if (existingConv.isPresent()) {
            conversation = existingConv.get();
            verifyMembership(conversation, currentUserId);
        } else {
            User recipient = userRepository.findById(request.getRecipientUserId())
                    .orElseGet(() -> userRepository.findByUsername(request.getRecipientUserId().replace("@", ""))
                    .orElseThrow(() -> new ResourceNotFoundException("Recipient user not found: " + request.getRecipientUserId())));

            if (recipient.getId().equals(currentUserId)) {
                throw new BadRequestException("You cannot start a conversation with yourself");
            }

            conversation = conversationRepository.findBetweenUsers(currentUserId, recipient.getId())
                    .orElseGet(() -> {
                        Conversation c = new Conversation();
                        c.getMembers().add(sender);
                        c.getMembers().add(recipient);
                        return conversationRepository.save(c);
                    });
        }

        Message message = new Message(conversation, sender, request.getContent().trim());
        Message saved = messageRepository.save(message);

        conversation.setUpdatedAt(OffsetDateTime.now());
        conversationRepository.save(conversation);

        return mapToMessageResponse(saved);
    }

    private void verifyMembership(Conversation conversation, String userId) {
        boolean isMember = conversation.getMembers().stream().anyMatch(m -> m.getId().equals(userId));
        if (!isMember) {
            throw new UnauthorizedException("You are not a member of this conversation");
        }
    }

    private ConversationResponse mapToConversationResponse(Conversation c, String currentUserId) {
        ConversationResponse dto = new ConversationResponse();
        dto.setId(c.getId());
        dto.setUpdatedAt(c.getUpdatedAt());

        // Find other member
        User otherUser = c.getMembers().stream()
                .filter(m -> !m.getId().equals(currentUserId))
                .findFirst()
                .orElse(null);

        if (otherUser != null) {
            Profile otherProfile = profileRepository.findByUserId(otherUser.getId()).orElse(null);
            if (otherProfile != null) {
                dto.setOtherUser(profileService.mapToProfileResponse(otherProfile, currentUserId));
            }
        }

        List<Message> msgs = messageRepository.findByConversationIdOrderByCreatedAtAsc(c.getId());
        List<MessageResponse> msgDTOs = msgs.stream().map(this::mapToMessageResponse).collect(Collectors.toList());
        dto.setMessages(msgDTOs);
        if (!msgDTOs.isEmpty()) {
            dto.setLastMessage(msgDTOs.get(msgDTOs.size() - 1));
        }

        return dto;
    }

    private MessageResponse mapToMessageResponse(Message m) {
        MessageResponse dto = new MessageResponse();
        dto.setId(m.getId());
        dto.setConversationId(m.getConversation().getId());
        dto.setSenderId(m.getSender().getId());
        dto.setSenderUsername(m.getSender().getUsername());
        dto.setContent(m.getContent());
        dto.setCreatedAt(m.getCreatedAt());

        Profile p = profileRepository.findByUserId(m.getSender().getId()).orElse(null);
        if (p != null) {
            dto.setSenderName(p.getFullName());
            dto.setSenderAvatar(p.getProfilePhotoUrl());
        } else {
            dto.setSenderName(m.getSender().getUsername());
        }

        return dto;
    }
}
