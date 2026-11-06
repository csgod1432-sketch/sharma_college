-- ============================================================
-- VProfile — MySQL Database Setup for AWS RDS
-- Run this ONCE on your RDS instance to create the accounts DB
-- and seed the initial data the Java app needs.
-- ============================================================

CREATE DATABASE IF NOT EXISTS accounts
    CHARACTER SET utf8
    COLLATE utf8_general_ci;

USE accounts;

-- ── Tables ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `role` (
    `id`   INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `user` (
    `id`                   INT(11) NOT NULL AUTO_INCREMENT,
    `username`             VARCHAR(255) DEFAULT NULL,
    `userEmail`            VARCHAR(255) DEFAULT NULL,
    `profileImg`           VARCHAR(255) DEFAULT NULL,
    `profileImgPath`       VARCHAR(255) DEFAULT NULL,
    `dateOfBirth`          VARCHAR(255) DEFAULT NULL,
    `fatherName`           VARCHAR(255) DEFAULT NULL,
    `motherName`           VARCHAR(255) DEFAULT NULL,
    `gender`               VARCHAR(255) DEFAULT NULL,
    `maritalStatus`        VARCHAR(255) DEFAULT NULL,
    `permanentAddress`     VARCHAR(255) DEFAULT NULL,
    `tempAddress`          VARCHAR(255) DEFAULT NULL,
    `primaryOccupation`    VARCHAR(255) DEFAULT NULL,
    `secondaryOccupation`  VARCHAR(255) DEFAULT NULL,
    `skills`               VARCHAR(255) DEFAULT NULL,
    `phoneNumber`          VARCHAR(255) DEFAULT NULL,
    `secondaryPhoneNumber` VARCHAR(255) DEFAULT NULL,
    `nationality`          VARCHAR(255) DEFAULT NULL,
    `language`             VARCHAR(255) DEFAULT NULL,
    `workingExperience`    VARCHAR(255) DEFAULT NULL,
    `password`             VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `user_role` (
    `user_id` INT(11) NOT NULL,
    `role_id` INT(11) NOT NULL,
    PRIMARY KEY (`user_id`, `role_id`),
    KEY `fk_user_role_roleid_idx` (`role_id`),
    CONSTRAINT `fk_user_role_roleid` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_user_role_userid` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ── Seed Data ────────────────────────────────────────────────

INSERT IGNORE INTO `role` VALUES (1, 'ROLE_USER');

-- Default admin user (password: admin_vp)
INSERT IGNORE INTO `user` (id, username, userEmail, password)
VALUES (7, 'admin_vp', 'admin@hkhinfo.com',
        '$2a$11$0a7VdTr4rfCQqtsvpng6GuJnzUmQ7gZiHXgzGPgm5hkRa3avXgBLK');

INSERT IGNORE INTO `user_role` VALUES (7, 1);
