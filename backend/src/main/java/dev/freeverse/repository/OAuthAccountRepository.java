package dev.freeverse.repository;

import dev.freeverse.entity.OAuthAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OAuthAccountRepository extends JpaRepository<OAuthAccount, String> {
    Optional<OAuthAccount> findByProviderAndProviderId(String provider, String providerId);
}
