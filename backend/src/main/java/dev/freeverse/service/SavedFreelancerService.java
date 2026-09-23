package dev.freeverse.service;

import dev.freeverse.dto.ProfileResponse;
import dev.freeverse.entity.Profile;
import dev.freeverse.entity.SavedFreelancer;
import dev.freeverse.entity.User;
import dev.freeverse.exception.BadRequestException;
import dev.freeverse.exception.ResourceNotFoundException;
import dev.freeverse.repository.ProfileRepository;
import dev.freeverse.repository.SavedFreelancerRepository;
import dev.freeverse.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedFreelancerService {

    private final SavedFreelancerRepository savedFreelancerRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ProfileService profileService;

    public SavedFreelancerService(
            SavedFreelancerRepository savedFreelancerRepository,
            UserRepository userRepository,
            ProfileRepository profileRepository,
            ProfileService profileService) {
        this.savedFreelancerRepository = savedFreelancerRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.profileService = profileService;
    }

    @Transactional
    public void saveFreelancer(String userId, String profileId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Profile profile = profileRepository.findById(profileId)
                .orElseGet(() -> profileRepository.findByUserId(profileId)
                .orElseGet(() -> profileRepository.findByUserUsername(profileId.replace("@", ""))
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer profile not found: " + profileId))));

        if (profile.getUser().getId().equals(userId)) {
            throw new BadRequestException("You cannot save your own profile");
        }

        if (savedFreelancerRepository.existsByUserIdAndProfileId(userId, profile.getId())) {
            return; // Already saved
        }

        SavedFreelancer saved = new SavedFreelancer(user, profile);
        savedFreelancerRepository.save(saved);
    }

    @Transactional
    public void unsaveFreelancer(String userId, String profileId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseGet(() -> profileRepository.findByUserId(profileId)
                .orElseGet(() -> profileRepository.findByUserUsername(profileId.replace("@", ""))
                .orElse(null)));

        String targetProfileId = profile != null ? profile.getId() : profileId;
        savedFreelancerRepository.deleteByUserIdAndProfileId(userId, targetProfileId);
    }

    @Transactional(readOnly = true)
    public List<ProfileResponse> getSavedFreelancers(String userId) {
        List<SavedFreelancer> savedList = savedFreelancerRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return savedList.stream()
                .map(s -> profileService.mapToProfileResponse(s.getProfile(), userId))
                .collect(Collectors.toList());
    }
}
