package dev.freeverse.storage;

import dev.freeverse.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class LocalStorageServiceImpl implements StorageService {

    private final Path rootLocation;
    private final String baseUrl;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "webp");
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("image/jpeg", "image/png", "image/webp");

    public LocalStorageServiceImpl(
            @Value("${app.file-storage-path:./uploads}") String uploadPath,
            @Value("${app.base-url:http://localhost:8080}") String baseUrl) {
        this.rootLocation = Paths.get(uploadPath).toAbsolutePath().normalize();
        this.baseUrl = baseUrl;
        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subDir) {
        if (file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg");
        String extension = "";
        int i = originalFilename.lastIndexOf('.');
        if (i > 0) {
            extension = originalFilename.substring(i + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Invalid file extension. Only JPG, PNG, and WEBP images are allowed.");
        }

        String contentType = file.getContentType();
        if (contentType != null && !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid file content type. Only JPEG, PNG, and WEBP images are allowed.");
        }

        String newFilename = UUID.randomUUID().toString() + "." + extension;
        Path targetDir = rootLocation.resolve(subDir).normalize();

        try {
            Files.createDirectories(targetDir);
            Path targetLocation = targetDir.resolve(newFilename);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            return baseUrl + "/uploads/" + subDir + "/" + newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + newFilename, e);
        }
    }
}
