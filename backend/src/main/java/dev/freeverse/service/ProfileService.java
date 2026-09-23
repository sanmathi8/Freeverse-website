package dev.freeverse.service;

import dev.freeverse.dto.ProfileRequest;
import dev.freeverse.dto.ProfileResponse;
import dev.freeverse.dto.ProjectRequest;
import dev.freeverse.dto.ProjectResponse;
import dev.freeverse.entity.*;
import dev.freeverse.exception.ResourceNotFoundException;
import dev.freeverse.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ServiceRepository serviceRepository;
    private final ProjectRepository projectRepository;

    public ProfileService(
            ProfileRepository profileRepository,
            UserRepository userRepository,
            SkillRepository skillRepository,
            ServiceRepository serviceRepository,
            ProjectRepository projectRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.serviceRepository = serviceRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfileByUserId(String targetUserId, String currentUserId) {
        Profile profile = profileRepository.findByUserId(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user ID: " + targetUserId));
        return mapToProfileResponse(profile, currentUserId);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfileByUsername(String username, String currentUserId) {
        Profile profile = profileRepository.findByUserUsername(username.toLowerCase().replace("@", ""))
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for username: " + username));
        return mapToProfileResponse(profile, currentUserId);
    }

    @Transactional
    public ProfileResponse createOrUpdateProfile(String userId, ProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Profile profile = profileRepository.findByUserId(userId).orElseGet(() -> {
            Profile p = new Profile();
            p.setUser(user);
            return p;
        });

        if (request.getFullName() != null) profile.setFullName(request.getFullName().trim());
        if (request.getProfilePhotoUrl() != null) profile.setProfilePhotoUrl(request.getProfilePhotoUrl().trim());
        if (request.getProfessionalTitle() != null) profile.setProfessionalTitle(request.getProfessionalTitle().trim());
        if (request.getAbout() != null) profile.setAbout(request.getAbout().trim());
        if (request.getCollege() != null) profile.setCollege(request.getCollege().trim());
        if (request.getDegree() != null) profile.setDegree(request.getDegree().trim());
        if (request.getGraduationYear() != null) profile.setGraduationYear(request.getGraduationYear().trim());
        if (request.getGithubUrl() != null) profile.setGithubUrl(request.getGithubUrl().trim());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl().trim());
        if (request.getPortfolioUrl() != null) profile.setPortfolioUrl(request.getPortfolioUrl().trim());
        if (request.getAvailability() != null) profile.setAvailability(request.getAvailability().trim());

        // Update skills
        if (request.getSkills() != null) {
            Set<Skill> skillEntities = new HashSet<>();
            for (String skillName : request.getSkills()) {
                String cleanName = skillName.trim();
                if (!cleanName.isEmpty()) {
                    Skill s = skillRepository.findByNameIgnoreCase(cleanName)
                            .orElseGet(() -> skillRepository.save(new Skill(cleanName)));
                    skillEntities.add(s);
                }
            }
            profile.setSkills(skillEntities);
        }

        // Update services
        if (request.getServices() != null) {
            Set<ServiceEntity> serviceEntities = new HashSet<>();
            for (String serviceName : request.getServices()) {
                String cleanName = serviceName.trim();
                if (!cleanName.isEmpty()) {
                    ServiceEntity srv = serviceRepository.findByNameIgnoreCase(cleanName)
                            .orElseGet(() -> serviceRepository.save(new ServiceEntity(cleanName)));
                    serviceEntities.add(srv);
                }
            }
            profile.setServices(serviceEntities);
        }

        Profile savedProfile = profileRepository.save(profile);

        // Add initial project if passed during creation
        if (request.getInitialProject() != null && (savedProfile.getProjects() == null || savedProfile.getProjects().isEmpty())) {
            ProjectRequest pReq = request.getInitialProject();
            Project initialProj = new Project();
            initialProj.setProfile(savedProfile);
            initialProj.setTitle(pReq.getTitle().trim());
            initialProj.setDescription(pReq.getDescription().trim());
            initialProj.setCategory(pReq.getCategory().trim());
            initialProj.setTechnologies(pReq.getTechnologies().trim());
            initialProj.setImageUrl(pReq.getImageUrl().trim());
            initialProj.setLiveUrl(pReq.getLiveUrl() != null ? pReq.getLiveUrl().trim() : null);
            initialProj.setGithubUrl(pReq.getGithubUrl() != null ? pReq.getGithubUrl().trim() : null);
            initialProj.setCompletionYear(pReq.getCompletionYear() != null ? pReq.getCompletionYear().trim() : null);
            projectRepository.save(initialProj);
            savedProfile.getProjects().add(initialProj);
        }

        return mapToProfileResponse(savedProfile, userId);
    }

    public ProfileResponse mapToProfileResponse(Profile profile, String currentUserId) {
        ProfileResponse dto = new ProfileResponse();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setName(profile.getFullName());
        dto.setUsername(profile.getUser().getUsername());
        dto.setEmail(profile.getUser().getEmail());
        dto.setTitle(profile.getProfessionalTitle());
        dto.setAbout(profile.getAbout());
        dto.setAvatar(profile.getProfilePhotoUrl() != null && !profile.getProfilePhotoUrl().isEmpty()
                ? profile.getProfilePhotoUrl()
                : generateAvatarFallback(profile.getFullName()));
        dto.setCollege(profile.getCollege());
        dto.setDegree(profile.getDegree());
        dto.setGraduationYear(profile.getGraduationYear());

        // Format Education string
        List<String> eduParts = new ArrayList<>();
        if (profile.getDegree() != null && !profile.getDegree().isEmpty()) eduParts.add(profile.getDegree());
        if (profile.getCollege() != null && !profile.getCollege().isEmpty()) eduParts.add(profile.getCollege());
        if (profile.getGraduationYear() != null && !profile.getGraduationYear().isEmpty()) eduParts.add(profile.getGraduationYear());
        dto.setEducation(String.join(", ", eduParts));

        dto.setSkills(profile.getSkills().stream().map(Skill::getName).collect(Collectors.toList()));
        dto.setServices(profile.getServices().stream().map(ServiceEntity::getName).collect(Collectors.toList()));
        dto.setGithub(profile.getGithubUrl());
        dto.setLinkedin(profile.getLinkedinUrl());
        dto.setPortfolio(profile.getPortfolioUrl());
        dto.setAvailability(profile.getAvailability());

        List<ProjectResponse> projectDTOs = profile.getProjects().stream().map(this::mapToProjectResponse).collect(Collectors.toList());
        dto.setProjects(projectDTOs);
        dto.setProjectCount(projectDTOs.size());
        dto.setFeaturedProject(!projectDTOs.isEmpty() ? projectDTOs.get(0).getTitle() : "None");

        // Derived categories
        Set<String> categories = new HashSet<>();
        for (ProjectResponse p : projectDTOs) {
            if (p.getCategory() != null) categories.add(p.getCategory().toUpperCase());
        }
        if (categories.isEmpty()) categories.add("WEB DEVELOPMENT");
        dto.setCategory(new ArrayList<>(categories));

        dto.setProfileCompletionPercentage(calculateCompletionPercentage(profile));
        dto.setOwner(currentUserId != null && currentUserId.equals(profile.getUser().getId()));

        return dto;
    }

    public ProjectResponse mapToProjectResponse(Project project) {
        ProjectResponse dto = new ProjectResponse();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setCategory(project.getCategory());

        List<String> techs = Arrays.stream(project.getTechnologies().split(","))
                .map(String::trim)
                .filter(t -> !t.isEmpty())
                .collect(Collectors.toList());
        dto.setTechnologies(techs);
        dto.setImage(project.getImageUrl());
        dto.setProjectLink(project.getLiveUrl());
        dto.setGithubLink(project.getGithubUrl());
        dto.setCompletionYear(project.getCompletionYear());
        return dto;
    }

    private int calculateCompletionPercentage(Profile p) {
        int score = 0;
        int total = 10;
        if (p.getProfilePhotoUrl() != null && !p.getProfilePhotoUrl().isEmpty()) score++;
        if (p.getFullName() != null && !p.getFullName().isEmpty()) score++;
        if (p.getProfessionalTitle() != null && !p.getProfessionalTitle().isEmpty()) score++;
        if (p.getAbout() != null && !p.getAbout().isEmpty()) score++;
        if (p.getCollege() != null || p.getDegree() != null) score++;
        if (p.getSkills() != null && !p.getSkills().isEmpty()) score++;
        if (p.getServices() != null && !p.getServices().isEmpty()) score++;
        if (p.getGithubUrl() != null || p.getLinkedinUrl() != null || p.getPortfolioUrl() != null) score++;
        if (p.getProjects() != null && !p.getProjects().isEmpty()) score++;
        if (p.getAvailability() != null) score++;

        return (score * 100) / total;
    }

    private String generateAvatarFallback(String name) {
        String initial = (name != null && !name.isEmpty()) ? name.substring(0, 1).toUpperCase() : "F";
        String svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" viewBox=\"0 0 200 200\">"
                + "<defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"%230ea5e9\"/><stop offset=\"100%\" stop-color=\"%230284c7\"/></linearGradient></defs>"
                + "<rect width=\"200\" height=\"200\" rx=\"100\" fill=\"%230b1b2b\"/>"
                + "<circle cx=\"100\" cy=\"100\" r=\"94\" fill=\"url(%23g)\" opacity=\"0.25\"/>"
                + "<circle cx=\"100\" cy=\"75\" r=\"34\" fill=\"%2338bdf8\"/>"
                + "<path d=\"M40,165 C40,125 70,115 100,115 C130,115 160,125 160,165 Z\" fill=\"%2338bdf8\"/>"
                + "<circle cx=\"100\" cy=\"100\" r=\"95\" stroke=\"%2367e8f9\" stroke-width=\"5\" fill=\"none\"/>"
                + "<text x=\"100\" y=\"112\" font-size=\"44\" font-family=\"system-ui, sans-serif\" font-weight=\"800\" fill=\"%23ffffff\" text-anchor=\"middle\">" + initial + "</text>"
                + "</svg>";
        return "data:image/svg+xml;utf8," + java.net.URLEncoder.encode(svg, java.nio.charset.StandardCharsets.UTF_8);
    }

    @Transactional
    public void deleteProfileByUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        userRepository.delete(user);
    }
}
