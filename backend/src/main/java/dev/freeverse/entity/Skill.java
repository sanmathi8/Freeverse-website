package dev.freeverse.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = "sk-" + UUID.randomUUID().toString();
        }
    }

    public Skill() {}

    public Skill(String name) {
        this.name = name;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
