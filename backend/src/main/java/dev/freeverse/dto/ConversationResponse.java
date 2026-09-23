package dev.freeverse.dto;

import java.time.OffsetDateTime;
import java.util.List;

public class ConversationResponse {

    private String id;
    private ProfileResponse otherUser;
    private MessageResponse lastMessage;
    private OffsetDateTime updatedAt;
    private List<MessageResponse> messages;

    public ConversationResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public ProfileResponse getOtherUser() { return otherUser; }
    public void setOtherUser(ProfileResponse otherUser) { this.otherUser = otherUser; }

    public MessageResponse getLastMessage() { return lastMessage; }
    public void setLastMessage(MessageResponse lastMessage) { this.lastMessage = lastMessage; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<MessageResponse> getMessages() { return messages; }
    public void setMessages(List<MessageResponse> messages) { this.messages = messages; }
}
