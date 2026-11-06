-- ============================================================
-- Sharma ERP – MySQL Database Setup
-- Run this once in your MySQL client / Workbench / phpMyAdmin
-- ============================================================

CREATE DATABASE IF NOT EXISTS sharma_erp
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sharma_erp;

CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    roll_no     VARCHAR(50)  NOT NULL UNIQUE,          -- Roll No (student) / Employee ID (faculty/admin)
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,                 -- bcrypt hash (never plain text)
    first_name  VARCHAR(100) DEFAULT '',
    middle_name VARCHAR(100) DEFAULT '',
    last_name   VARCHAR(100) DEFAULT '',
    course      VARCHAR(50)  DEFAULT '',               -- Course name or Department
    year        VARCHAR(20)  DEFAULT '',               -- Batch year or joining year
    role        ENUM('student','college','admin') DEFAULT 'student',
    photo_url   LONGTEXT     DEFAULT NULL,
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP
);

-- Optional: index for faster email lookups
CREATE INDEX idx_users_email ON users(email);