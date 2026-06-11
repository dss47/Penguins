/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.3.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: penguin_db
-- ------------------------------------------------------
-- Server version	12.2.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `ai_tools`
--

DROP TABLE IF EXISTS `ai_tools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_tools` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `validated_by` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `logo_url` varchar(2083) DEFAULT NULL,
  `website_url` varchar(2083) NOT NULL,
  `global_rating` decimal(3,2) DEFAULT NULL,
  `website_rating` decimal(3,2) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `status` enum('pending','active','archived','deprecated') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_ai_tools_category_id_categories` (`category_id`),
  KEY `fk_ai_tools_created_by_users` (`created_by`),
  KEY `fk_ai_tools_provider_id_providers` (`provider_id`),
  KEY `fk_ai_tools_validated_by_users` (`validated_by`),
  CONSTRAINT `fk_ai_tools_category_id_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_ai_tools_created_by_users` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_ai_tools_provider_id_providers` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`),
  CONSTRAINT `fk_ai_tools_validated_by_users` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon` varchar(10) DEFAULT NULL COMMENT 'Stores an emoji representing the category',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `favorite_items`
--

DROP TABLE IF EXISTS `favorite_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tool_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_favorite_items_user_tool` (`user_id`,`tool_id`),
  KEY `fk_favorite_items_tool_id_ai_tools` (`tool_id`),
  CONSTRAINT `fk_favorite_items_tool_id_ai_tools` FOREIGN KEY (`tool_id`) REFERENCES `ai_tools` (`id`),
  CONSTRAINT `fk_favorite_items_user_id_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `features`
--

DROP TABLE IF EXISTS `features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `features` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('modality','access','licensing','capability') DEFAULT NULL,
  `status` enum('active','disabled') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `models`
--

DROP TABLE IF EXISTS `models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `models` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `provider_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','deprecated','beta') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_models_provider_id_providers` (`provider_id`),
  CONSTRAINT `fk_models_provider_id_providers` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `professions`
--

DROP TABLE IF EXISTS `professions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `professions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `providers`
--

DROP TABLE IF EXISTS `providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `providers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `website_url` varchar(2083) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','active','archived') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `rating` tinyint(4) NOT NULL,
  `status` enum('approved','pending','flagged') NOT NULL DEFAULT 'pending',
  `ai_flag_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tool_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reviews_user_id_users` (`user_id`),
  KEY `fk_reviews_tool_id_ai_tools` (`tool_id`),
  CONSTRAINT `fk_reviews_tool_id_ai_tools` FOREIGN KEY (`tool_id`) REFERENCES `ai_tools` (`id`),
  CONSTRAINT `fk_reviews_user_id_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_histories`
--

DROP TABLE IF EXISTS `search_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `search_histories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `prompt_text` text NOT NULL,
  `search_type` enum('ai_prompt','keyword') NOT NULL DEFAULT 'keyword',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `title` varchar(255) NOT NULL DEFAULT 'AI Recommendation Chat',
  `ai_reasoning` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_search_histories_user_id_users` (`user_id`),
  CONSTRAINT `fk_search_histories_user_id_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_history_tools`
--

DROP TABLE IF EXISTS `search_history_tools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `search_history_tools` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `search_history_id` int(11) NOT NULL,
  `tool_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sht_history_idx` (`search_history_id`),
  KEY `fk_sht_tool_idx` (`tool_id`),
  CONSTRAINT `fk_sht_history` FOREIGN KEY (`search_history_id`) REFERENCES `search_histories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sht_tool` FOREIGN KEY (`tool_id`) REFERENCES `ai_tools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shelf_items`
--

DROP TABLE IF EXISTS `shelf_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `shelf_items` (
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shelf_id` int(11) NOT NULL,
  `tool_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_shelf_items_shelf_tool` (`shelf_id`,`tool_id`),
  KEY `fk_shelf_items_tool_id_ai_tools` (`tool_id`),
  CONSTRAINT `fk_shelf_items_shelf_id_shelves` FOREIGN KEY (`shelf_id`) REFERENCES `shelves` (`id`),
  CONSTRAINT `fk_shelf_items_tool_id_ai_tools` FOREIGN KEY (`tool_id`) REFERENCES `ai_tools` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shelves`
--

DROP TABLE IF EXISTS `shelves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `shelves` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_shelves_user_id_users` (`user_id`),
  CONSTRAINT `fk_shelves_user_id_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `suggestions`
--

DROP TABLE IF EXISTS `suggestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `suggestions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `provider_id` int(11) DEFAULT NULL,
  `model_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `logo_url` varchar(2083) DEFAULT NULL,
  `website_url` varchar(2083) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `proposed_provider_name` varchar(255) DEFAULT NULL,
  `proposed_model_name` varchar(255) DEFAULT NULL,
  `proposed_new_features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`proposed_new_features`)),
  `existing_feature_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`existing_feature_ids`)),
  `release_date` date DEFAULT NULL,
  `why_this_tool` text DEFAULT NULL,
  `status` enum('pending_ai','rejected_ai','pending_manager','rejected_manager','approved') NOT NULL DEFAULT 'pending_ai',
  `rejection_reason` text DEFAULT NULL,
  `ai_moderation_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_suggestions_user_id_users` (`user_id`),
  KEY `fk_suggestions_category_id_categories` (`category_id`),
  KEY `fk_suggestions_provider_id_providers` (`provider_id`),
  KEY `fk_suggestions_model_id_models` (`model_id`),
  CONSTRAINT `fk_suggestions_category_id_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_suggestions_model_id_models` FOREIGN KEY (`model_id`) REFERENCES `models` (`id`),
  CONSTRAINT `fk_suggestions_provider_id_providers` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`),
  CONSTRAINT `fk_suggestions_user_id_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tool_features`
--

DROP TABLE IF EXISTS `tool_features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tool_features` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tool_id` int(11) NOT NULL,
  `feature_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tool_features_tool_feature` (`tool_id`,`feature_id`),
  KEY `fk_tool_features_feature_id_features` (`feature_id`),
  CONSTRAINT `fk_tool_features_feature_id_features` FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`),
  CONSTRAINT `fk_tool_features_tool_id_ai_tools` FOREIGN KEY (`tool_id`) REFERENCES `ai_tools` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tool_models`
--

DROP TABLE IF EXISTS `tool_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tool_models` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tool_id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tm_tool_idx` (`tool_id`),
  KEY `fk_tm_model_idx` (`model_id`),
  CONSTRAINT `fk_tm_model` FOREIGN KEY (`model_id`) REFERENCES `models` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tm_tool` FOREIGN KEY (`tool_id`) REFERENCES `ai_tools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profession_id` int(11) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `profile_url` varchar(2083) DEFAULT NULL,
  `role` enum('admin','user','manager','guest') NOT NULL DEFAULT 'user',
  `status` enum('active','suspended','deleted') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_users_profession_id_professions` (`profession_id`),
  CONSTRAINT `fk_users_profession_id_professions` FOREIGN KEY (`profession_id`) REFERENCES `professions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-06-11 19:39:19
