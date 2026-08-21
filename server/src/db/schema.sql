-- ==============================================================================
-- StillSkudy Phase 2: PostgreSQL Schema Migrations
-- Supports Student Accounts, Parent Oversight, Cloud IDE Workspaces, and Delta Sync
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('student', 'parent', 'admin')),
    display_name VARCHAR(128) NOT NULL,
    grade_level VARCHAR(64),
    bio TEXT,
    avatar_icon VARCHAR(64) DEFAULT 'GraduationCap',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Parent-Student Link Table
CREATE TABLE IF NOT EXISTS parent_student_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invite_code VARCHAR(32),
    status VARCHAR(32) NOT NULL CHECK (status IN ('pending', 'active', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);

-- 3. Student Progress & Learning Metrics
CREATE TABLE IF NOT EXISTS student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completed_lessons JSONB DEFAULT '{}'::jsonb,
    completed_challenges JSONB DEFAULT '{}'::jsonb,
    lesson_notes JSONB DEFAULT '{}'::jsonb,
    streak JSONB DEFAULT '{"current": 1, "longest": 1, "lastActiveDate": ""}'::jsonb,
    stats JSONB DEFAULT '{"lessonsCompleted": 0, "challengesCompleted": 0, "practiceQuizzesTaken": 0, "practiceAccuracy": 100, "projectsCompleted": 0, "codingTimeMinutes": 0}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    version BIGINT DEFAULT 1,
    UNIQUE(student_id)
);

-- 4. Cloud IDE Projects & Virtual Filesystem
CREATE TABLE IF NOT EXISTS ide_projects (
    id VARCHAR(64) PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_id VARCHAR(64),
    files JSONB NOT NULL,
    active_file_name VARCHAR(255) DEFAULT 'index.html',
    open_tabs TEXT[] DEFAULT ARRAY['index.html', 'style.css', 'script.js'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 5. Managed Projects
CREATE TABLE IF NOT EXISTS managed_projects (
    id VARCHAR(64) PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    skill VARCHAR(64),
    difficulty VARCHAR(32),
    technologies TEXT[],
    status VARCHAR(32) DEFAULT 'in_progress',
    progress INT DEFAULT 0,
    tasks JSONB DEFAULT '[]'::jsonb,
    milestones JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    linked_ide_project_id VARCHAR(64),
    in_portfolio BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 6. Planner Tasks
CREATE TABLE IF NOT EXISTS planner_tasks (
    id VARCHAR(64) PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    duration_minutes INT DEFAULT 25,
    priority VARCHAR(16) DEFAULT 'medium',
    category VARCHAR(32) DEFAULT 'Coding',
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 7. Practice Attempts
CREATE TABLE IF NOT EXISTS practice_attempts (
    id VARCHAR(64) PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_or_skill_id VARCHAR(64) NOT NULL,
    subject_or_skill_name VARCHAR(128) NOT NULL,
    total_questions INT NOT NULL,
    score INT NOT NULL,
    accuracy INT NOT NULL,
    answers JSONB NOT NULL,
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Portfolios
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    custom_title VARCHAR(255),
    bio TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    featured_project_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
    featured_ide_project_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
    show_achievements BOOLEAN DEFAULT TRUE,
    show_stats BOOLEAN DEFAULT TRUE,
    social_links JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id)
);

-- 9. Sync Delta Changelog
CREATE TABLE IF NOT EXISTS sync_changelog (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    operation VARCHAR(16) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    payload JSONB,
    server_timestamp TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sync_changelog_student ON sync_changelog(student_id, server_timestamp);
