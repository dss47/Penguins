-- Auto-generated from docs/Database.erd
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE `ai_tools` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category_id` INT NOT NULL,
  `provider_id` INT NOT NULL,
  `created_by` INT,
  `validated_by` INT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `logo_url` VARCHAR(2083),
  `website_url` VARCHAR(2083) NOT NULL,
  `global_rating` DECIMAL(3,2),
  `release_date` DATE,
  `status` ENUM('pending', 'active', 'archived', 'deprecated') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `profession_id` INT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `profile_url` VARCHAR(2083),
  `role` ENUM('admin','user','manager','guest') NOT NULL DEFAULT 'user',
  `status` ENUM('active','suspended','deleted') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `providers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL UNIQUE,
  `website_url` VARCHAR(2083),
  `description` TEXT,
  `status` ENUM('pending', 'active', 'archived') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `models` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `provider_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `status` ENUM('active', 'deprecated', 'beta') NOT NULL DEFAULT 'active',
  `tags` VARCHAR(255),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `features` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `type` VARCHAR(50),
  `status` ENUM('active' , 'disabled') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `favorite_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tool_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `shelves` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `shelf_items` (
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INT NOT NULL AUTO_INCREMENT,
  `shelf_id` INT NOT NULL,
  `tool_id` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `comment` TEXT,
  `rating` TINYINT NOT NULL,
  `status` ENUM('approved', 'pending','flagged') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tool_id` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `search_histories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `prompt_text` TEXT NOT NULL,
  `search_type` ENUM('ai_prompt','keyword') NOT NULL DEFAULT 'keyword',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title` VARCHAR(150),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `tool_features` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tool_id` INT NOT NULL,
  `feature_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `model_features` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `model_id` INT NOT NULL,
  `feature_id` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `search_history_categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category_id` INT NOT NULL,
  `search_history_id` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `suggestions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `provider_id` INT,
  `model_id` INT,
  `name` VARCHAR(255) NOT NULL,
  `website_url` VARCHAR(2083),
  `description` TEXT,
  `proposed_provider_name` VARCHAR(255),
  `proposed_model_name` VARCHAR(255),
  `proposed_new_features` JSON,
  `existing_feature_ids` JSON,
  `release_date` DATE,
  `why_this_tool` TEXT,
  `status` ENUM('pending_ai', 'rejected_ai', 'pending_manager', 'rejected_manager', 'approved') NOT NULL DEFAULT 'pending_ai',
  `rejection_reason` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `professions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `favorite_items` ADD UNIQUE KEY `uq_favorite_items_user_tool` (`user_id`, `tool_id`);
ALTER TABLE `shelf_items` ADD UNIQUE KEY `uq_shelf_items_shelf_tool` (`shelf_id`, `tool_id`);
ALTER TABLE `tool_features` ADD UNIQUE KEY `uq_tool_features_tool_feature` (`tool_id`, `feature_id`);
ALTER TABLE `model_features` ADD UNIQUE KEY `uq_model_features_model_feature` (`model_id`, `feature_id`);
ALTER TABLE `search_history_categories` ADD UNIQUE KEY `uq_search_history_categories_search_category` (`search_history_id`, `category_id`);

ALTER TABLE `ai_tools` ADD CONSTRAINT `fk_ai_tools_category_id_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
ALTER TABLE `ai_tools` ADD CONSTRAINT `fk_ai_tools_created_by_users` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);
ALTER TABLE `ai_tools` ADD CONSTRAINT `fk_ai_tools_provider_id_providers` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`);
ALTER TABLE `models` ADD CONSTRAINT `fk_models_provider_id_providers` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`);
ALTER TABLE `favorite_items` ADD CONSTRAINT `fk_favorite_items_user_id_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `favorite_items` ADD CONSTRAINT `fk_favorite_items_tool_id_ai_tools` FOREIGN KEY (`tool_id`) REFERENCES `ai_tools` (`id`);
ALTER TABLE `shelves` ADD CONSTRAINT `fk_shelves_user_id_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `shelf_items` ADD CONSTRAINT `fk_shelf_items_shelf_id_shelves` FOREIGN KEY (`shelf_id`) REFERENCES `shelves` (`id`);
ALTER TABLE `shelf_items` ADD CONSTRAINT `fk_shelf_items_tool_id_ai_tools` FOREIGN KEY (`tool_id`) REFERENCES `ai_tools` (`id`);
ALTER TABLE `reviews` ADD CONSTRAINT `fk_reviews_user_id_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `reviews` ADD CONSTRAINT `fk_reviews_tool_id_ai_tools` FOREIGN KEY (`tool_id`) REFERENCES `ai_tools` (`id`);
ALTER TABLE `search_histories` ADD CONSTRAINT `fk_search_histories_user_id_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `search_history_categories` ADD CONSTRAINT `fk_search_history_categories_category_id_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
ALTER TABLE `search_history_categories` ADD CONSTRAINT `fk_search_history_categories_search_history_id_search_histor` FOREIGN KEY (`search_history_id`) REFERENCES `search_histories` (`id`);
ALTER TABLE `tool_features` ADD CONSTRAINT `fk_tool_features_tool_id_ai_tools` FOREIGN KEY (`tool_id`) REFERENCES `ai_tools` (`id`);
ALTER TABLE `tool_features` ADD CONSTRAINT `fk_tool_features_feature_id_features` FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`);
ALTER TABLE `model_features` ADD CONSTRAINT `fk_model_features_model_id_models` FOREIGN KEY (`model_id`) REFERENCES `models` (`id`);
ALTER TABLE `model_features` ADD CONSTRAINT `fk_model_features_feature_id_features` FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`);
ALTER TABLE `ai_tools` ADD CONSTRAINT `fk_ai_tools_validated_by_users` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`);
ALTER TABLE `suggestions` ADD CONSTRAINT `fk_suggestions_user_id_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `suggestions` ADD CONSTRAINT `fk_suggestions_category_id_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
ALTER TABLE `suggestions` ADD CONSTRAINT `fk_suggestions_provider_id_providers` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`);
ALTER TABLE `suggestions` ADD CONSTRAINT `fk_suggestions_model_id_models` FOREIGN KEY (`model_id`) REFERENCES `models` (`id`);
ALTER TABLE `users` ADD CONSTRAINT `fk_users_profession_id_professions` FOREIGN KEY (`profession_id`) REFERENCES `professions` (`id`);

SET FOREIGN_KEY_CHECKS = 1;
