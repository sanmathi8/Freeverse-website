package dev.freeverse.dto;

import jakarta.validation.constraints.NotBlank;

public class HireRequestCreate {

    @NotBlank(message = "Freelancer ID is required")
    private String freelancerId;

    @NotBlank(message = "Project title is required")
    private String projectTitle;

    @NotBlank(message = "Description is required")
    private String description;

    private String budget;

    public HireRequestCreate() {}

    public String getFreelancerId() { return freelancerId; }
    public void setFreelancerId(String freelancerId) { this.freelancerId = freelancerId; }

    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBudget() { return budget; }
    public void setBudget(String budget) { this.budget = budget; }
}
