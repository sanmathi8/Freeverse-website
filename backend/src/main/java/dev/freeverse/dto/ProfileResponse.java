package dev.freeverse.dto;

import java.util.List;

public class ProfileResponse {

    private String id;
    private String userId;
    private String name;
    private String username;
    private String email;
    private String title;
    private String about;
    private String avatar;
    private String college;
    private String degree;
    private String graduationYear;
    private String education;
    private List<String> skills;
    private List<String> services;
    private String github;
    private String linkedin;
    private String portfolio;
    private String availability;
    private List<ProjectResponse> projects;
    private String featuredProject;
    private int projectCount;
    private List<String> category;
    private int profileCompletionPercentage;
    private boolean isOwner;

    public ProfileResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getGraduationYear() { return graduationYear; }
    public void setGraduationYear(String graduationYear) { this.graduationYear = graduationYear; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<String> getServices() { return services; }
    public void setServices(List<String> services) { this.services = services; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getPortfolio() { return portfolio; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public List<ProjectResponse> getProjects() { return projects; }
    public void setProjects(List<ProjectResponse> projects) { this.projects = projects; }

    public String getFeaturedProject() { return featuredProject; }
    public void setFeaturedProject(String featuredProject) { this.featuredProject = featuredProject; }

    public int getProjectCount() { return projectCount; }
    public void setProjectCount(int projectCount) { this.projectCount = projectCount; }

    public List<String> getCategory() { return category; }
    public void setCategory(List<String> category) { this.category = category; }

    public int getProfileCompletionPercentage() { return profileCompletionPercentage; }
    public void setProfileCompletionPercentage(int profileCompletionPercentage) { this.profileCompletionPercentage = profileCompletionPercentage; }

    public boolean isOwner() { return isOwner; }
    public void setOwner(boolean owner) { isOwner = owner; }
}
