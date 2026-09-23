# Freeverse — Production Student Digital Ecosystem

Freeverse is a student networking, portfolio showcase, and freelancer marketplace platform empowering student developers, designers, AI specialists, and digital creators.

---

## Technical Architecture Overview

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Three.js (WebGL 3D Experience), Lucide Icons.
- **Backend**: Java 21, Spring Boot 3.3.4, Spring Security (Stateless JWT + BCrypt), Spring Data JPA, Jakarta Validation, Spring Mail, OpenAPI / Swagger UI.
- **Database**: PostgreSQL 16 (Relational DB with normalized schema, Flyway migrations, and performance indexing).
- **Storage**: Modular File Storage Abstraction (Local filesystem in dev, configurable for Cloudinary / Supabase / AWS S3 in production).

---

## Getting Started & Setup Guide

### 1. Database Setup (PostgreSQL)

You can run PostgreSQL locally using Docker or a native PostgreSQL 16 server:

#### Option A: Docker Compose (Recommended)
```bash
docker-compose up -d
```

#### Option B: Native PostgreSQL
Ensure PostgreSQL is running on `localhost:5432` and create a database:
```sql
CREATE DATABASE freeverse_db;
CREATE USER freeverse_user WITH PASSWORD 'freeverse_password';
GRANT ALL PRIVILEGES ON DATABASE freeverse_db TO freeverse_user;
```

---

### 2. Backend Setup (Spring Boot)

1. Copy environment template:
```bash
cp backend/.env.example backend/.env
```

2. Configure environment variables in `backend/.env` (or pass via system environment):
- `DATABASE_URL=jdbc:postgresql://localhost:5432/freeverse_db`
- `DATABASE_USERNAME=freeverse_user`
- `DATABASE_PASSWORD=freeverse_password`
- `JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
- `GOOGLE_CLIENT_ID=your-client-id`
- `GOOGLE_CLIENT_SECRET=your-client-secret`

3. Compile & Start Spring Boot Server:
```bash
cd backend
./mvnw spring-boot:run
```
*(Backend runs on `http://localhost:8080`)*

4. Access Interactive OpenAPI / Swagger Documentation:
- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- API Docs JSON: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

### 3. Frontend Setup (React + Vite)

1. Install dependencies:
```bash
npm install
```

2. Start Frontend Dev Server:
```bash
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

3. Build Production Bundle:
```bash
npm run build
```

---

## Core API Endpoints Reference

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Register new student account |
| **Auth** | `POST` | `/api/auth/login` | Sign in & receive JWT token |
| **Auth** | `POST` | `/api/auth/verify-email` | Verify email with token |
| **Auth** | `POST` | `/api/auth/oauth2/google` | Google OAuth2 authentication |
| **Profiles** | `GET` | `/api/profiles/me` | Get current user's profile |
| **Profiles** | `PUT` | `/api/profiles/me` | Create / Update profile & skills |
| **Profiles** | `GET` | `/api/profiles/{username}` | Get public freelancer profile |
| **Freelancers** | `GET` | `/api/freelancers` | Paginated marketplace with filters |
| **Projects** | `POST` | `/api/projects` | Add project (Ownership check) |
| **Projects** | `PUT` | `/api/projects/{id}` | Edit project (Owner only) |
| **Projects** | `DELETE` | `/api/projects/{id}` | Delete project (Owner only) |
| **Messaging** | `POST` | `/api/conversations/messages` | Send user-to-user message |
| **Hire** | `POST` | `/api/hire-requests` | Send project hire request |
| **Hire** | `PUT` | `/api/hire-requests/{id}/accept` | Accept hire request |
| **Saved** | `POST` | `/api/saved-freelancers/{profileId}` | Bookmark freelancer profile |
| **Uploads** | `POST` | `/api/uploads/profile-image` | Upload & compress profile photo |

---

## Testing & Verification Commands

### Backend Verification
```bash
cd backend
./mvnw clean test
./mvnw clean package -DskipTests
```

### Frontend Verification
```bash
npm run build
```
