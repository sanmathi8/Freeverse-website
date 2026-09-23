package dev.freeverse.repository;

import dev.freeverse.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, String> {

    @Query("SELECT c FROM Conversation c JOIN c.members m WHERE m.id = :userId ORDER BY c.updatedAt DESC")
    List<Conversation> findByUserId(@Param("userId") String userId);

    @Query("SELECT c FROM Conversation c JOIN c.members m1 JOIN c.members m2 " +
           "WHERE m1.id = :user1Id AND m2.id = :user2Id")
    Optional<Conversation> findBetweenUsers(@Param("user1Id") String user1Id, @Param("user2Id") String user2Id);
}
