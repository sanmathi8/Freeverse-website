-- Flyway Migration V1: Database Schema Creation for Freeverse

-- 1. USERS TABLE
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    enabled BOOLEAN DEFAULT TRUE,
    auth_provider VARCHAR(50) DEFAULT 'LOCAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- 2. PROFILES TABLE
CREATE TABLE profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    profile_photo_url TEXT,
    professional_title VARCHAR(200) NOT NULL,
    about TEXT NOT NULL,
    college VARCHAR(200),
    degree VARCHAR(200),
    graduation_year VARCHAR(20),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    availability VARCHAR(100) DEFAULT 'Available for Hire',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- 3. SKILLS & PROFILE_SKILLS TABLES
CREATE TABLE skills (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE profile_skills (
    profile_id VARCHAR(64) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id VARCHAR(64) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, skill_id)
);

CREATE INDEX idx_profile_skills_profile ON profile_skills(profile_id);

-- 4. SERVICES & PROFILE_SERVICES TABLES
CREATE TABLE services (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE profile_services (
    profile_id VARCHAR(64) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    service_id VARCHAR(64) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, service_id)
);

CREATE INDEX idx_profile_services_profile ON profile_services(profile_id);

-- 5. PROJECTS TABLE
CREATE TABLE projects (
    id VARCHAR(64) PRIMARY KEY,
    profile_id VARCHAR(64) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    technologies TEXT NOT NULL,
    image_url TEXT NOT NULL,
    live_url VARCHAR(255),
    github_url VARCHAR(255),
    completion_year VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_profile_id ON projects(profile_id);

-- 6. CONVERSATIONS & MESSAGES TABLES
CREATE TABLE conversations (
    id VARCHAR(64) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_members (
    conversation_id VARCHAR(64) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX idx_conv_members_user ON conversation_members(user_id);

CREATE TABLE messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conv ON messages(conversation_id);

-- 7. HIRE_REQUESTS TABLE
CREATE TABLE hire_requests (
    id VARCHAR(64) PRIMARY KEY,
    requester_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    freelancer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    budget VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hire_req_requester ON hire_requests(requester_id);
CREATE INDEX idx_hire_req_freelancer ON hire_requests(freelancer_id);

-- 8. SAVED_FREELANCERS TABLE
CREATE TABLE saved_freelancers (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_id VARCHAR(64) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_saved_profile UNIQUE (user_id, profile_id)
);

CREATE INDEX idx_saved_freelancers_user ON saved_freelancers(user_id);

-- 9. AUTH TOKENS TABLES
CREATE TABLE email_verification_tokens (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_tokens (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. OAUTH ACCOUNTS TABLE
CREATE TABLE oauth_accounts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_provider_id UNIQUE (provider, provider_id)
);
