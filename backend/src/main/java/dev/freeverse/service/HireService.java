package dev.freeverse.service;

import dev.freeverse.dto.HireRequestCreate;
import dev.freeverse.dto.HireRequestResponse;
import dev.freeverse.entity.HireRequest;
import dev.freeverse.entity.Profile;
import dev.freeverse.entity.User;
import dev.freeverse.exception.BadRequestException;
import dev.freeverse.exception.ResourceNotFoundException;
import dev.freeverse.exception.UnauthorizedException;
import dev.freeverse.repository.HireRequestRepository;
import dev.freeverse.repository.ProfileRepository;
import dev.freeverse.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HireService {

    private final HireRequestRepository hireRequestRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public HireService(
            HireRequestRepository hireRequestRepository,
            UserRepository userRepository,
            ProfileRepository profileRepository) {
        this.hireRequestRepository = hireRequestRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public HireRequestResponse createHireRequest(String requesterId, HireRequestCreate request) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Requester user not found"));

        User freelancer = userRepository.findById(request.getFreelancerId())
                .orElseGet(() -> userRepository.findByUsername(request.getFreelancerId().replace("@", ""))
                .orElseGet(() -> {
                    Profile p = profileRepository.findById(request.getFreelancerId())
                            .orElseThrow(() -> new ResourceNotFoundException("Freelancer profile not found"));
                    return p.getUser();
                }));

        if (freelancer.getId().equals(requesterId)) {
            throw new BadRequestException("You cannot send a hire request to yourself");
        }

        HireRequest hireReq = new HireRequest();
        hireReq.setRequester(requester);
        hireReq.setFreelancer(freelancer);
        hireReq.setProjectTitle(request.getProjectTitle().trim());
        hireReq.setDescription(request.getDescription().trim());
        hireReq.setBudget(request.getBudget() != null ? request.getBudget().trim() : "Custom / Negotiable");
        hireReq.setStatus(HireRequest.Status.PENDING);

        HireRequest saved = hireRequestRepository.save(hireReq);
        return mapToHireRequestResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<HireRequestResponse> getSentHireRequests(String requesterId) {
        return hireRequestRepository.findByRequesterIdOrderByCreatedAtDesc(requesterId)
                .stream()
                .map(this::mapToHireRequestResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HireRequestResponse> getReceivedHireRequests(String freelancerId) {
        return hireRequestRepository.findByFreelancerIdOrderByCreatedAtDesc(freelancerId)
                .stream()
                .map(this::mapToHireRequestResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public HireRequestResponse updateStatus(String currentUserId, String requestId, HireRequest.Status newStatus) {
        HireRequest req = hireRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Hire request not found: " + requestId));

        // Authorization checks for status transition
        if (newStatus == HireRequest.Status.ACCEPTED || newStatus == HireRequest.Status.DECLINED) {
            if (!req.getFreelancer().getId().equals(currentUserId)) {
                throw new UnauthorizedException("Only the target freelancer can accept or decline this request");
            }
        } else if (newStatus == HireRequest.Status.CANCELLED) {
            if (!req.getRequester().getId().equals(currentUserId)) {
                throw new UnauthorizedException("Only the requester can cancel this request");
            }
        } else if (newStatus == HireRequest.Status.COMPLETED) {
            if (!req.getRequester().getId().equals(currentUserId) && !req.getFreelancer().getId().equals(currentUserId)) {
                throw new UnauthorizedException("Only participants can mark this request as completed");
            }
        }

        req.setStatus(newStatus);
        HireRequest saved = hireRequestRepository.save(req);
        return mapToHireRequestResponse(saved);
    }

    private HireRequestResponse mapToHireRequestResponse(HireRequest r) {
        HireRequestResponse dto = new HireRequestResponse();
        dto.setId(r.getId());
        dto.setRequesterId(r.getRequester().getId());
        dto.setFreelancerId(r.getFreelancer().getId());
        dto.setProjectTitle(r.getProjectTitle());
        dto.setDescription(r.getDescription());
        dto.setBudget(r.getBudget());
        dto.setStatus(r.getStatus().name());
        dto.setCreatedAt(r.getCreatedAt());

        Profile reqProf = profileRepository.findByUserId(r.getRequester().getId()).orElse(null);
        dto.setRequesterName(reqProf != null ? reqProf.getFullName() : r.getRequester().getUsername());

        Profile freeProf = profileRepository.findByUserId(r.getFreelancer().getId()).orElse(null);
        dto.setFreelancerName(freeProf != null ? freeProf.getFullName() : r.getFreelancer().getUsername());

        return dto;
    }
}
