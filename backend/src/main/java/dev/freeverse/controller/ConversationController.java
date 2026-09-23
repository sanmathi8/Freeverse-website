package dev.freeverse.controller;

import dev.freeverse.dto.ApiResponse;
import dev.freeverse.dto.ConversationResponse;
import dev.freeverse.dto.MessageRequest;
import dev.freeverse.dto.MessageResponse;
import dev.freeverse.security.UserPrincipal;
import dev.freeverse.service.MessagingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@Tag(name = "Messaging", description = "User-to-user conversation and messaging endpoints")
public class ConversationController {

    private final MessagingService messagingService;

    public ConversationController(MessagingService messagingService) {
        this.messagingService = messagingService;
    }

    @GetMapping
    @Operation(summary = "Get all conversations for the authenticated user")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getMyConversations(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ConversationResponse> conversations = messagingService.getUserConversations(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Conversations retrieved successfully", conversations));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific conversation messages (Membership check enforced)")
    public ResponseEntity<ApiResponse<ConversationResponse>> getConversationById(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        ConversationResponse conversation = messagingService.getConversationById(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Conversation retrieved successfully", conversation));
    }

    @PostMapping("/messages")
    @Operation(summary = "Send a message to a user or conversation")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody MessageRequest request) {
        MessageResponse sent = messagingService.sendMessage(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Message sent successfully", sent));
    }
}
