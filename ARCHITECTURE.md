# Freeverse System Architecture Specification

## 1. System Components Diagram

```
+-------------------------------------------------------------------+
|                     React + Vite Frontend                         |
|  - 3D WebGL Canvas (Three.js)                                      |
|  - Freeverse Crystal Glassmorphism UI (Tailwind CSS)              |
|  - AuthContext & Centralized Fetch API Client                     |
+----------------------------------+--------------------------------+
                                   |
                                   | REST APIs / JWT Bearer Token
                                   v
+-------------------------------------------------------------------+
|                    Spring Boot 3.3 Backend                        |
|                                                                   |
|  [ Security Layer ]                                               |
|    - JwtAuthenticationFilter                                     |
|    - BCryptPasswordEncoder                                        |
|    - OAuth2 Client (Google Login)                                 |
|                                                                   |
|  [ Controllers Layer ]                                            |
|    - AuthController         - ProfileController                   |
|    - FreelancerController   - ProjectController                   |
|    - ConversationController - HireRequestController               |
|    - SavedFreelancerCtrl    - UploadController                    |
|                                                                   |
|  [ Services Layer ]                                               |
|    - AuthService            - ProfileService                      |
|    - ProjectService          - MessagingService                    |
|    - HireService            - LocalStorageServiceImpl             |
+----------------------------------+--------------------------------+
                                   |
                                   | Spring Data JPA / Flyway SQL
                                   v
+-------------------------------------------------------------------+
|                    PostgreSQL Database (v16)                      |
|                                                                   |
|  Tables:                                                          |
|  - users                     - profiles                           |
|  - skills                    - profile_skills                     |
|  - services                  - profile_services                   |
|  - projects                  - conversations                      |
|  - conversation_members      - messages                           |
|  - hire_requests             - saved_freelancers                  |
|  - email_verification_tokens - password_reset_tokens              |
|  - oauth_accounts                                                 |
+-------------------------------------------------------------------+
```

## 2. Entity-Relationship Schema Overview

- **User (1) ── (1) Profile**: One-to-one mapping between user security account and freelancer profile.
- **Profile (M) ── (N) Skill**: Many-to-many relationship mapped via `profile_skills` join table.
- **Profile (M) ── (N) Service**: Many-to-many relationship mapped via `profile_services` join table.
- **Profile (1) ── (N) Project**: One-to-many relationship representing portfolio projects.
- **User (M) ── (N) Conversation**: Many-to-many membership mapping via `conversation_members`.
- **Conversation (1) ── (N) Message**: Messages contained within user-to-user conversations.
- **User (1) ── (N) HireRequest**: Hire requests sent/received with statuses (`PENDING`, `ACCEPTED`, `DECLINED`, `COMPLETED`, `CANCELLED`).
- **User (M) ── (N) SavedFreelancer**: Bookmarked freelancer profiles.

## 3. Data Integrity & Security Standards
- Password Hashes: Hashed using BCrypt. Plaintext passwords are never stored or logged.
- Ownership Verification: All project mutation requests (`PUT /api/projects/{id}`, `DELETE /api/projects/{id}`) verify that `project.profile.user.id` matches the authenticated JWT principal.
- Image Asset Storage: Images are stored on filesystem/cloud storage abstraction and stored strictly as asset URLs in PostgreSQL to avoid database bloat.
