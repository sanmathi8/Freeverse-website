package dev.freeverse.repository;

import dev.freeverse.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, String> {
    Optional<Skill> findByNameIgnoreCase(String name);
}
