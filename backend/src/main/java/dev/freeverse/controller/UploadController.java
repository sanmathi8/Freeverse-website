package dev.freeverse.controller;

import dev.freeverse.dto.ApiResponse;
import dev.freeverse.dto.UploadResponse;
import dev.freeverse.storage.StorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
@Tag(name = "Image Storage", description = "File storage endpoints returning accessible asset URLs")
public class UploadController {

    private final StorageService storageService;

    public UploadController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/profile-image")
    @Operation(summary = "Upload profile photo")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        String url = storageService.storeFile(file, "profiles");
        return ResponseEntity.ok(ApiResponse.ok("Profile image uploaded successfully", new UploadResponse(url, file.getOriginalFilename())));
    }

    @PostMapping("/project-image")
    @Operation(summary = "Upload project thumbnail image")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadProjectImage(@RequestParam("file") MultipartFile file) {
        String url = storageService.storeFile(file, "projects");
        return ResponseEntity.ok(ApiResponse.ok("Project image uploaded successfully", new UploadResponse(url, file.getOriginalFilename())));
    }
}
