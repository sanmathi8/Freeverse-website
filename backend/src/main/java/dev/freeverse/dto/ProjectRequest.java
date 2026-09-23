package dev.freeverse.dto;

import jakarta.validation.constraints.NotBlank;

public class ProjectRequest {

    @NotBlank(message = "Project title is required")
    private String title;

    @NotBlank(message = "Project description is required")
    private String description;

    @NotBlank(message = "Project category is required")
    private String category;

    @NotBlank(message = "Technologies used are required")
    private String technologies;

    @NotBlank(message = "Project image URL is required")
    private String imageUrl;

    private String liveUrl;
    private String githubUrl;
    private String completionYear;

    public ProjectRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTechnologies() { return technologies; }
    public void setTechnologies(String technologies) { this.technologies = technologies; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getLiveUrl() { return liveUrl; }
    public void setLiveUrl(String liveUrl) { this.liveUrl = liveUrl; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getCompletionYear() { return completionYear; }
    public void setCompletionYear(String completionYear) { this.completionYear = completionYear; }
}
