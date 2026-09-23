package dev.freeverse.repository;

import dev.freeverse.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    List<Project> findByProfileId(String profileId);
    Page<Project> findByProfileId(String profileId, Pageable pageable);
}
