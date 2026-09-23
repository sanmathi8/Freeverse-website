package dev.freeverse.controller;

import dev.freeverse.dto.ApiResponse;
import dev.freeverse.dto.ProjectRequest;
import dev.freeverse.dto.ProjectResponse;
import dev.freeverse.security.UserPrincipal;
import dev.freeverse.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "Projects", description = "Project portfolio management endpoints with ownership enforcement")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get all projects owned by current user")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getMyProjects(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ProjectResponse> projects = projectService.getMyProjects(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("User projects retrieved successfully", projects));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project details by ID")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable String id) {
        ProjectResponse project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.ok("Project details retrieved successfully", project));
    }

    @PostMapping
    @Operation(summary = "Add a new project to current user's profile")
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ProjectRequest request) {
        ProjectResponse created = projectService.createProject(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Project created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing project (Ownership verification required)")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id,
            @Valid @RequestBody ProjectRequest request) {
        ProjectResponse updated = projectService.updateProject(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Project updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an existing project (Ownership verification required)")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        projectService.deleteProject(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Project deleted successfully"));
    }
}
