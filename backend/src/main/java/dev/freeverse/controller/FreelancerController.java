package dev.freeverse.controller;

import dev.freeverse.dto.ApiResponse;
import dev.freeverse.dto.ProfileResponse;
import dev.freeverse.security.UserPrincipal;
import dev.freeverse.service.FreelancerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/freelancers")
@Tag(name = "Freelancer Marketplace", description = "Public marketplace listing with filters and pagination")
public class FreelancerController {

    private final FreelancerService freelancerService;

    public FreelancerController(FreelancerService freelancerService) {
        this.freelancerService = freelancerService;
    }

    @GetMapping
    @Operation(summary = "Get paginated list of freelancers with optional skill, service, category, and keyword filters")
    public ResponseEntity<ApiResponse<Page<ProfileResponse>>> getFreelancers(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String service,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        Page<ProfileResponse> freelancers = freelancerService.getFreelancers(
                skill, service, category, availability, search, page, size, currentUserId
        );
        return ResponseEntity.ok(ApiResponse.ok("Freelancers retrieved successfully", freelancers));
    }
}
