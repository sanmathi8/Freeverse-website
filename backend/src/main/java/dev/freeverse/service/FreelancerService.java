package dev.freeverse.service;

import dev.freeverse.dto.ProfileResponse;
import dev.freeverse.entity.Profile;
import dev.freeverse.repository.ProfileRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FreelancerService {

    private final ProfileRepository profileRepository;
    private final ProfileService profileService;

    public FreelancerService(ProfileRepository profileRepository, ProfileService profileService) {
        this.profileRepository = profileRepository;
        this.profileService = profileService;
    }

    @Transactional(readOnly = true)
    public Page<ProfileResponse> getFreelancers(
            String skill,
            String service,
            String category,
            String availability,
            String search,
            int page,
            int size,
            String currentUserId) {

        String skillParam = (skill != null && !skill.equalsIgnoreCase("ALL")) ? skill : null;
        String serviceParam = (service != null && !service.trim().isEmpty()) ? service : null;
        String categoryParam = (category != null && !category.equalsIgnoreCase("ALL")) ? category : null;
        String availabilityParam = (availability != null && !availability.trim().isEmpty()) ? availability : null;
        String searchParam = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Profile> profiles = profileRepository.filterFreelancers(
                skillParam, serviceParam, categoryParam, availabilityParam, searchParam, pageable
        );

        List<ProfileResponse> content = profiles.getContent().stream()
                .map(p -> profileService.mapToProfileResponse(p, currentUserId))
                .collect(Collectors.toList());

        return new PageImpl<>(content, pageable, profiles.getTotalElements());
    }
}
