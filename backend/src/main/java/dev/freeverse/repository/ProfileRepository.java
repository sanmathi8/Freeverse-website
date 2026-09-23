package dev.freeverse.repository;

import dev.freeverse.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, String>, JpaSpecificationExecutor<Profile> {
    Optional<Profile> findByUserId(String userId);
    Optional<Profile> findByUserUsername(String username);

    @Query("SELECT DISTINCT p FROM Profile p " +
           "LEFT JOIN p.skills s " +
           "LEFT JOIN p.services srv " +
           "LEFT JOIN p.projects prj " +
           "WHERE (:skill IS NULL OR UPPER(s.name) = UPPER(:skill)) " +
           "AND (:service IS NULL OR UPPER(srv.name) = UPPER(:service)) " +
           "AND (:category IS NULL OR UPPER(prj.category) = UPPER(:category)) " +
           "AND (:availability IS NULL OR p.availability = :availability) " +
           "AND (:search IS NULL OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(p.professionalTitle) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(p.about) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(p.user.username) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Profile> filterFreelancers(
        @Param("skill") String skill,
        @Param("service") String service,
        @Param("category") String category,
        @Param("availability") String availability,
        @Param("search") String search,
        Pageable pageable
    );
}
