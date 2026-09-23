package dev.freeverse.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class ProfileRequest {

    @NotBlank(message = "Full Name is required")
    private String fullName;

    private String profilePhotoUrl;

    @NotBlank(message = "Professional title is required")
    private String professionalTitle;

    @NotBlank(message = "About details are required")
    private String about;

    private String college;
    private String degree;
    private String graduationYear;

    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private String availability;

    private List<String> skills;
    private List<String> services;

    // Optional initial project when creating profile for the first time
    private ProjectRequest initialProject;

    public ProfileRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public String getProfessionalTitle() { return professionalTitle; }
    public void setProfessionalTitle(String professionalTitle) { this.professionalTitle = professionalTitle; }

    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getGraduationYear() { return graduationYear; }
    public void setGraduationYear(String graduationYear) { this.graduationYear = graduationYear; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<String> getServices() { return services; }
    public void setServices(List<String> services) { this.services = services; }

    public ProjectRequest getInitialProject() { return initialProject; }
    public void setInitialProject(ProjectRequest initialProject) { this.initialProject = initialProject; }
}
