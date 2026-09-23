package dev.freeverse.repository;

import dev.freeverse.entity.HireRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HireRequestRepository extends JpaRepository<HireRequest, String> {
    List<HireRequest> findByRequesterIdOrderByCreatedAtDesc(String requesterId);
    List<HireRequest> findByFreelancerIdOrderByCreatedAtDesc(String freelancerId);
    Page<HireRequest> findByRequesterId(String requesterId, Pageable pageable);
    Page<HireRequest> findByFreelancerId(String freelancerId, Pageable pageable);
}
