package dev.freeverse.controller;

import dev.freeverse.dto.*;
import dev.freeverse.security.UserPrincipal;
import dev.freeverse.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Register, login, verify email, password reset, and OAuth endpoints")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new student account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful. Please verify your email.", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email or username")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Verify email address using token")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.ok("Email successfully verified"));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request a password reset email")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        authService.forgotPassword(email);
        return ResponseEntity.ok(ApiResponse.ok("Password reset email sent"));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok("Password successfully reset"));
    }

    @PostMapping("/oauth2/google")
    @Operation(summary = "Google OAuth2 Login / Sign up callback endpoint")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String googleId = body.get("googleId");
        String name = body.get("name");
        String picture = body.get("picture");

        AuthResponse response = authService.loginOrRegisterGoogle(email, googleId, name, picture);
        return ResponseEntity.ok(ApiResponse.ok("Google authentication successful", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user info")
    public ResponseEntity<ApiResponse<UserPrincipal>> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.ok("Current user details", userPrincipal));
    }
}
