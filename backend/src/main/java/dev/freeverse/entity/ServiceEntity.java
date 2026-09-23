package dev.freeverse.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "services")
public class ServiceEntity {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = "srv-" + UUID.randomUUID().toString();
        }
    }

    public ServiceEntity() {}

    public ServiceEntity(String name) {
        this.name = name;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
