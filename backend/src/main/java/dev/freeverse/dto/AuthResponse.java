package dev.freeverse.dto;

public class AuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private String userId;
    private String username;
    private String email;
    private boolean emailVerified;
    private ProfileResponse profile;

    public AuthResponse() {}

    public AuthResponse(String accessToken, String userId, String username, String email, boolean emailVerified) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.emailVerified = emailVerified;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public ProfileResponse getProfile() { return profile; }
    public void setProfile(ProfileResponse profile) { this.profile = profile; }
}
