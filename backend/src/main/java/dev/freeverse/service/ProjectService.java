package dev.freeverse.service;

import dev.freeverse.dto.ProjectRequest;
import dev.freeverse.dto.ProjectResponse;
import dev.freeverse.entity.Profile;
import dev.freeverse.entity.Project;
import dev.freeverse.exception.ResourceNotFoundException;
import dev.freeverse.exception.UnauthorizedException;
import dev.freeverse.repository.ProfileRepository;
import dev.freeverse.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProfileRepository profileRepository;
    private final ProfileService profileService;

    public ProjectService(ProjectRepository projectRepository, ProfileRepository profileRepository, ProfileService profileService) {
        this.projectRepository = projectRepository;
        this.profileRepository = profileRepository;
        this.profileService = profileService;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getMyProjects(String userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));

        return projectRepository.findByProfileId(profile.getId())
                .stream()
                .map(profileService::mapToProjectResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));
        return profileService.mapToProjectResponse(project);
    }

    @Transactional
    public ProjectResponse createProject(String userId, ProjectRequest request) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));

        Project project = new Project();
        project.setProfile(profile);
        project.setTitle(request.getTitle().trim());
        project.setDescription(request.getDescription().trim());
        project.setCategory(request.getCategory().trim());
        project.setTechnologies(request.getTechnologies().trim());
        project.setImageUrl(request.getImageUrl().trim());
        project.setLiveUrl(request.getLiveUrl() != null ? request.getLiveUrl().trim() : null);
        project.setGithubUrl(request.getGithubUrl() != null ? request.getGithubUrl().trim() : null);
        project.setCompletionYear(request.getCompletionYear() != null ? request.getCompletionYear().trim() : null);

        Project saved = projectRepository.save(project);
        return profileService.mapToProjectResponse(saved);
    }

    @Transactional
    public ProjectResponse updateProject(String userId, String projectId, ProjectRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        // Strict ownership check
        if (!project.getProfile().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this project");
        }

        project.setTitle(request.getTitle().trim());
        project.setDescription(request.getDescription().trim());
        project.setCategory(request.getCategory().trim());
        project.setTechnologies(request.getTechnologies().trim());
        project.setImageUrl(request.getImageUrl().trim());
        project.setLiveUrl(request.getLiveUrl() != null ? request.getLiveUrl().trim() : null);
        project.setGithubUrl(request.getGithubUrl() != null ? request.getGithubUrl().trim() : null);
        project.setCompletionYear(request.getCompletionYear() != null ? request.getCompletionYear().trim() : null);

        Project saved = projectRepository.save(project);
        return profileService.mapToProjectResponse(saved);
    }

    @Transactional
    public void deleteProject(String userId, String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        // Strict ownership check
        if (!project.getProfile().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this project");
        }

        projectRepository.delete(project);
    }
}
