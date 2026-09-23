package dev.freeverse.controller;

import dev.freeverse.dto.ApiResponse;
import dev.freeverse.dto.ProfileResponse;
import dev.freeverse.security.UserPrincipal;
import dev.freeverse.service.SavedFreelancerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-freelancers")
@Tag(name = "Saved Freelancers", description = "Bookmark and save freelancer profiles")
public class SavedFreelancerController {

    private final SavedFreelancerService savedFreelancerService;

    public SavedFreelancerController(SavedFreelancerService savedFreelancerService) {
        this.savedFreelancerService = savedFreelancerService;
    }

    @GetMapping
    @Operation(summary = "Get list of freelancers saved by current user")
    public ResponseEntity<ApiResponse<List<ProfileResponse>>> getSavedFreelancers(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ProfileResponse> saved = savedFreelancerService.getSavedFreelancers(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Saved freelancers retrieved successfully", saved));
    }

    @PostMapping("/{profileId}")
    @Operation(summary = "Save / bookmark a freelancer profile")
    public ResponseEntity<ApiResponse<Void>> saveFreelancer(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String profileId) {
        savedFreelancerService.saveFreelancer(userPrincipal.getId(), profileId);
        return ResponseEntity.ok(ApiResponse.ok("Freelancer profile saved successfully"));
    }

    @DeleteMapping("/{profileId}")
    @Operation(summary = "Remove a saved freelancer profile")
    public ResponseEntity<ApiResponse<Void>> unsaveFreelancer(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String profileId) {
        savedFreelancerService.unsaveFreelancer(userPrincipal.getId(), profileId);
        return ResponseEntity.ok(ApiResponse.ok("Freelancer profile removed from saved list"));
    }
}
