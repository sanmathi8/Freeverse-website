package dev.freeverse.controller;

import dev.freeverse.dto.ApiResponse;
import dev.freeverse.dto.HireRequestCreate;
import dev.freeverse.dto.HireRequestResponse;
import dev.freeverse.entity.HireRequest;
import dev.freeverse.security.UserPrincipal;
import dev.freeverse.service.HireService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hire-requests")
@Tag(name = "Hire Requests", description = "Freelancer hire request endpoints (PENDING, ACCEPTED, DECLINED, COMPLETED, CANCELLED)")
public class HireRequestController {

    private final HireService hireService;

    public HireRequestController(HireService hireService) {
        this.hireService = hireService;
    }

    @PostMapping
    @Operation(summary = "Send a hire request to a freelancer")
    public ResponseEntity<ApiResponse<HireRequestResponse>> createHireRequest(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody HireRequestCreate request) {
        HireRequestResponse response = hireService.createHireRequest(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Hire request sent successfully", response));
    }

    @GetMapping("/sent")
    @Operation(summary = "Get hire requests sent by current user")
    public ResponseEntity<ApiResponse<List<HireRequestResponse>>> getSentHireRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<HireRequestResponse> requests = hireService.getSentHireRequests(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Sent hire requests retrieved successfully", requests));
    }

    @GetMapping("/received")
    @Operation(summary = "Get hire requests received by current user")
    public ResponseEntity<ApiResponse<List<HireRequestResponse>>> getReceivedHireRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<HireRequestResponse> requests = hireService.getReceivedHireRequests(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Received hire requests retrieved successfully", requests));
    }

    @PutMapping("/{id}/accept")
    @Operation(summary = "Accept a hire request")
    public ResponseEntity<ApiResponse<HireRequestResponse>> acceptHireRequest(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        HireRequestResponse response = hireService.updateStatus(userPrincipal.getId(), id, HireRequest.Status.ACCEPTED);
        return ResponseEntity.ok(ApiResponse.ok("Hire request accepted", response));
    }

    @PutMapping("/{id}/decline")
    @Operation(summary = "Decline a hire request")
    public ResponseEntity<ApiResponse<HireRequestResponse>> declineHireRequest(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        HireRequestResponse response = hireService.updateStatus(userPrincipal.getId(), id, HireRequest.Status.DECLINED);
        return ResponseEntity.ok(ApiResponse.ok("Hire request declined", response));
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Mark a hire request project as completed")
    public ResponseEntity<ApiResponse<HireRequestResponse>> completeHireRequest(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        HireRequestResponse response = hireService.updateStatus(userPrincipal.getId(), id, HireRequest.Status.COMPLETED);
        return ResponseEntity.ok(ApiResponse.ok("Hire request marked as completed", response));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel a hire request")
    public ResponseEntity<ApiResponse<HireRequestResponse>> cancelHireRequest(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        HireRequestResponse response = hireService.updateStatus(userPrincipal.getId(), id, HireRequest.Status.CANCELLED);
        return ResponseEntity.ok(ApiResponse.ok("Hire request cancelled", response));
    }
}
