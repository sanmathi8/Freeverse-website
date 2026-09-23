package dev.freeverse.dto;

import jakarta.validation.constraints.NotBlank;

public class MessageRequest {

    @NotBlank(message = "Recipient userId or conversationId is required")
    private String recipientUserId;

    @NotBlank(message = "Message content is required")
    private String content;

    public MessageRequest() {}

    public String getRecipientUserId() { return recipientUserId; }
    public void setRecipientUserId(String recipientUserId) { this.recipientUserId = recipientUserId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
