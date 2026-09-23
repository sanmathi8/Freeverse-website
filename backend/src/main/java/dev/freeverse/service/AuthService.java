package dev.freeverse.service;

import dev.freeverse.dto.*;
import dev.freeverse.entity.*;
import dev.freeverse.exception.BadRequestException;
import dev.freeverse.exception.ResourceNotFoundException;
import dev.freeverse.repository.*;
import dev.freeverse.security.JwtTokenProvider;
import dev.freeverse.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final EmailVerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final OAuthAccountRepository oauthAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;
    private final ProfileService profileService;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    public AuthService(
            UserRepository userRepository,
            ProfileRepository profileRepository,
            EmailVerificationTokenRepository verificationTokenRepository,
            PasswordResetTokenRepository resetTokenRepository,
            OAuthAccountRepository oauthAccountRepository,
            @org.springframework.context.annotation.Lazy PasswordEncoder passwordEncoder,
            @org.springframework.context.annotation.Lazy AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            EmailService emailService,
            ProfileService profileService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.oauthAccountRepository = oauthAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
        this.profileService = profileService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email is already registered");
        }
        if (userRepository.existsByUsername(request.getUsername().toLowerCase().trim().replace("@", ""))) {
            throw new BadRequestException("Username is already taken");
        }

        User user = new User(
                request.getEmail().toLowerCase().trim(),
                request.getUsername().toLowerCase().trim().replace("@", ""),
                passwordEncoder.encode(request.getPassword())
        );
        user.setEmailVerified(false);
        userRepository.save(user);

        // Auto-create initial profile shell
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setFullName(request.getFullName().trim());
        profile.setProfessionalTitle("Student Creator");
        profile.setAbout("Welcome to my Freeverse freelancer profile!");
        profileRepository.save(profile);

        // Generate cryptographically secure 6-digit confirmation code
        String code = String.format("%06d", new SecureRandom().nextInt(1000000));
        EmailVerificationToken verificationToken = new EmailVerificationToken(
                user, code, OffsetDateTime.now().plusDays(1)
        );
        verificationTokenRepository.save(verificationToken);

        // Send REAL email via SMTP
        emailService.sendVerificationCodeEmail(user.getEmail(), user.getUsername(), code);

        AuthResponse response = new AuthResponse(null, user.getId(), user.getUsername(), user.getEmail(), false);
        response.setProfile(profileService.getProfileByUserId(user.getId(), user.getId()));
        return response;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail().trim(), request.getPassword())
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isEmailVerified()) {
            throw new BadRequestException("Please verify your email address before logging in. Check your email for the 6-digit verification code.");
        }

        user.setLastLoginAt(OffsetDateTime.now());
        userRepository.save(user);

        String jwtToken = tokenProvider.generateToken(authentication);
        AuthResponse response = new AuthResponse(jwtToken, user.getId(), user.getUsername(), user.getEmail(), user.isEmailVerified());
        response.setProfile(profileService.getProfileByUserId(user.getId(), user.getId()));
        return response;
    }

    @Transactional
    public void verifyEmail(String codeStr) {
        if (codeStr == null || codeStr.trim().isEmpty()) {
            throw new BadRequestException("Verification code is required");
        }

        EmailVerificationToken token = verificationTokenRepository.findByToken(codeStr.trim())
                .orElseThrow(() -> new BadRequestException("Invalid 6-digit verification code. Please check your email inbox."));

        if (token.isUsed() || token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new BadRequestException("Verification code has expired or already been used.");
        }

        token.setUsed(true);
        verificationTokenRepository.save(token);

        User user = token.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Account with specified email not found"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(
                user, token, OffsetDateTime.now().plusHours(24)
        );
        resetTokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), token);
    }

    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        PasswordResetToken token = resetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid password reset token"));

        if (token.isUsed() || token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new BadRequestException("Reset token has expired or already been used");
        }

        token.setUsed(true);
        resetTokenRepository.save(token);

        User user = token.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public AuthResponse processOAuth2User(String provider, String providerId, String email, String name, String picture) {
        if (providerId == null || providerId.trim().isEmpty()) {
            throw new BadRequestException("Invalid OAuth2 user identifier from provider.");
        }

        if (email == null || email.trim().isEmpty()) {
            throw new BadRequestException("Google account must have a verified email address.");
        }

        String cleanEmail = email.toLowerCase().trim();

        // 1. Check if OAuth account relationship exists by provider + providerId (Google sub claim)
        OAuthAccount oauthAccount = oauthAccountRepository.findByProviderAndProviderId(provider.toUpperCase(), providerId).orElse(null);

        User user;
        if (oauthAccount != null) {
            user = oauthAccount.getUser();
            user.setEmailVerified(true);
            user.setLastLoginAt(OffsetDateTime.now());
            userRepository.save(user);
        } else {
            // 2. Check if user with email already exists in users table
            user = userRepository.findByEmail(cleanEmail).orElse(null);
            if (user == null) {
                String baseUsername = cleanEmail.split("@")[0].replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
                String username = baseUsername;
                int counter = 1;
                while (userRepository.existsByUsername(username)) {
                    username = baseUsername + counter++;
                }

                user = new User(cleanEmail, username, null);
                user.setEmailVerified(true);
                user.setAuthProvider(provider.toUpperCase());
                userRepository.save(user);

                Profile profile = new Profile();
                profile.setUser(user);
                profile.setFullName(name != null && !name.trim().isEmpty() ? name.trim() : username);
                profile.setProfilePhotoUrl(picture);
                profile.setProfessionalTitle("Student Creator");
                profile.setAbout("Welcome to my Freeverse profile!");
                profileRepository.save(profile);
            } else {
                user.setEmailVerified(true);
                user.setLastLoginAt(OffsetDateTime.now());
                userRepository.save(user);
            }

            // Save OAuth account association with Google sub claim
            OAuthAccount newOauthAccount = new OAuthAccount(user, provider.toUpperCase(), providerId);
            oauthAccountRepository.save(newOauthAccount);
        }

        String jwtToken = tokenProvider.generateTokenFromUserId(user.getId(), user.getEmail(), user.getUsername());
        AuthResponse response = new AuthResponse(jwtToken, user.getId(), user.getUsername(), user.getEmail(), user.isEmailVerified());
        response.setProfile(profileService.getProfileByUserId(user.getId(), user.getId()));
        return response;
    }

    @Transactional
    public AuthResponse loginOrRegisterGoogle(String email, String googleId, String name, String picture) {
        return processOAuth2User("GOOGLE", googleId, email, name, picture);
    }
}
