package dev.freeverse.dto;

import java.time.OffsetDateTime;

public class HireRequestResponse {

    private String id;
    private String requesterId;
    private String requesterName;
    private String freelancerId;
    private String freelancerName;
    private String projectTitle;
    private String description;
    private String budget;
    private String status;
    private OffsetDateTime createdAt;

    public HireRequestResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRequesterId() { return requesterId; }
    public void setRequesterId(String requesterId) { this.requesterId = requesterId; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

    public String getFreelancerId() { return freelancerId; }
    public void setFreelancerId(String freelancerId) { this.freelancerId = freelancerId; }

    public String getFreelancerName() { return freelancerName; }
    public void setFreelancerName(String freelancerName) { this.freelancerName = freelancerName; }

    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBudget() { return budget; }
    public void setBudget(String budget) { this.budget = budget; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
