package dev.freeverse.repository;

import dev.freeverse.entity.SavedFreelancer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedFreelancerRepository extends JpaRepository<SavedFreelancer, String> {
    List<SavedFreelancer> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<SavedFreelancer> findByUserIdAndProfileId(String userId, String profileId);
    boolean existsByUserIdAndProfileId(String userId, String profileId);
    void deleteByUserIdAndProfileId(String userId, String profileId);
}
