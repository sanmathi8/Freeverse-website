package dev.freeverse.dto;

import java.util.List;

public class ProjectResponse {

    private String id;
    private String title;
    private String description;
    private String category;
    private List<String> technologies;
    private String image;
    private String projectLink;
    private String githubLink;
    private String completionYear;

    public ProjectResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getTechnologies() { return technologies; }
    public void setTechnologies(List<String> technologies) { this.technologies = technologies; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getProjectLink() { return projectLink; }
    public void setProjectLink(String projectLink) { this.projectLink = projectLink; }

    public String getGithubLink() { return githubLink; }
    public void setGithubLink(String githubLink) { this.githubLink = githubLink; }

    public String getCompletionYear() { return completionYear; }
    public void setCompletionYear(String completionYear) { this.completionYear = completionYear; }
}
