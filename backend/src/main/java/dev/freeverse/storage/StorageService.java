package dev.freeverse.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String storeFile(MultipartFile file, String subDir);
}
