package dev.freeverse.repository;

import dev.freeverse.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, String> {
    Optional<ServiceEntity> findByNameIgnoreCase(String name);
}
