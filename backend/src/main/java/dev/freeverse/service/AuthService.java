package dev.freeverse.service;

import dev.freeverse.dto.*;
import dev.freeverse.entity.*;
import dev.freeverse.exception.BadRequestException;
import dev.freeverse.exception.ResourceNotFoundException;
import dev.freeverse.repository.*;
import dev.freeverse.security.JwtTokenProvider;
import dev.freeverse.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public AuthService(
            UserRepository userRepository,
            ProfileRepository profileRepository,
            EmailVerificationTokenRepository verificationTokenRepository,
            PasswordResetTokenRepository resetTokenRepository,
            OAuthAccountRepository oauthAccountRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
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
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
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

        // Create verification token
        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = new EmailVerificationToken(
                user, token, OffsetDateTime.now().plusDays(1)
        );
        verificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), token);

        String jwtToken = tokenProvider.generateTokenFromUserId(user.getId(), user.getEmail(), user.getUsername());
        AuthResponse response = new AuthResponse(jwtToken, user.getId(), user.getUsername(), user.getEmail(), user.isEmailVerified());
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

        user.setLastLoginAt(OffsetDateTime.now());
        userRepository.save(user);

        String jwtToken = tokenProvider.generateToken(authentication);
        AuthResponse response = new AuthResponse(jwtToken, user.getId(), user.getUsername(), user.getEmail(), user.isEmailVerified());
        response.setProfile(profileService.getProfileByUserId(user.getId(), user.getId()));
        return response;
    }

    @Transactional
    public void verifyEmail(String tokenStr) {
        EmailVerificationToken token = verificationTokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new BadRequestException("Invalid or expired email verification token"));

        if (token.isUsed() || token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new BadRequestException("Verification token has expired or already been used");
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
    public AuthResponse loginOrRegisterGoogle(String email, String googleId, String name, String picture) {
        User user = userRepository.findByEmail(email.toLowerCase().trim()).orElse(null);

        if (user == null) {
            String baseUsername = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
            String username = baseUsername;
            int counter = 1;
            while (userRepository.existsByUsername(username)) {
                username = baseUsername + counter++;
            }

            user = new User(email.toLowerCase().trim(), username, null);
            user.setEmailVerified(true);
            user.setAuthProvider("GOOGLE");
            userRepository.save(user);

            Profile profile = new Profile();
            profile.setUser(user);
            profile.setFullName(name != null ? name : username);
            profile.setProfilePhotoUrl(picture);
            profile.setProfessionalTitle("Student Creator");
            profile.setAbout("Welcome to my Freeverse profile!");
            profileRepository.save(profile);

            OAuthAccount oauthAccount = new OAuthAccount(user, "GOOGLE", googleId);
            oauthAccountRepository.save(oauthAccount);
        } else {
            user.setEmailVerified(true);
            user.setLastLoginAt(OffsetDateTime.now());
            userRepository.save(user);
        }

        String jwtToken = tokenProvider.generateTokenFromUserId(user.getId(), user.getEmail(), user.getUsername());
        AuthResponse response = new AuthResponse(jwtToken, user.getId(), user.getUsername(), user.getEmail(), user.isEmailVerified());
        response.setProfile(profileService.getProfileByUserId(user.getId(), user.getId()));
        return response;
    }
}
