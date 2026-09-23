package dev.freeverse.controller;

import dev.freeverse.dto.ApiResponse;
import dev.freeverse.dto.ProfileRequest;
import dev.freeverse.dto.ProfileResponse;
import dev.freeverse.security.UserPrincipal;
import dev.freeverse.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@Tag(name = "Profiles", description = "Freelancer profile management endpoints")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user's profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getMyProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        ProfileResponse profile = profileService.getProfileByUserId(userPrincipal.getId(), userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Profile retrieved successfully", profile));
    }

    @PutMapping("/me")
    @Operation(summary = "Create or update current authenticated user's profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ProfileRequest request) {
        ProfileResponse updated = profileService.createOrUpdateProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @GetMapping("/{username}")
    @Operation(summary = "Get public freelancer profile by username")
    public ResponseEntity<ApiResponse<ProfileResponse>> getPublicProfile(
            @PathVariable String username,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        ProfileResponse profile = profileService.getProfileByUsername(username, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok("Public profile retrieved successfully", profile));
    }

    @DeleteMapping("/me")
    @Operation(summary = "Delete current authenticated user's profile and account")
    public ResponseEntity<ApiResponse<Void>> deleteMyProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        profileService.deleteProfileByUserId(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Profile and account deleted successfully"));
    }
}
