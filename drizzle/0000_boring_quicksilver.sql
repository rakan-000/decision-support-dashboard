CREATE TABLE `actions` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text,
	`risk_id` text,
	`title` text NOT NULL,
	`title_ar` text,
	`description` text,
	`status` text DEFAULT 'open' NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`department_id` text,
	`owner_user_id` text,
	`due_date` text,
	`completed_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`risk_id`) REFERENCES `risks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `activity_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`action` text NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`metadata` text,
	`ip_address` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name_en` text NOT NULL,
	`name_ar` text NOT NULL,
	`description_en` text,
	`description_ar` text,
	`head_user_id` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `departments_code_unique` ON `departments` (`code`);--> statement-breakpoint
CREATE TABLE `document_analyses` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`executive_summary` text,
	`key_insights` text,
	`governance_review` text,
	`compliance_review` text,
	`gap_analysis` text,
	`root_cause_analysis` text,
	`swot_analysis` text,
	`pestel_analysis` text,
	`kpi_opportunities` text,
	`dept_classification` text,
	`priority_level` text,
	`confidence_score` real,
	`compliance_score` real,
	`governance_score` real,
	`kb_sources_used` text,
	`analysis_model` text,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `document_analyses_document_id_unique` ON `document_analyses` (`document_id`);--> statement-breakpoint
CREATE TABLE `document_chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`chunk_text` text NOT NULL,
	`chunk_index` integer DEFAULT 0 NOT NULL,
	`embedding` text,
	`token_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`file_type` text NOT NULL,
	`storage_key` text NOT NULL,
	`file_size_kb` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`department_id` text,
	`uploaded_by` text,
	`priority` text,
	`detected_owner` text,
	`detected_dates` text,
	`language` text,
	`extracted_text` text,
	`extracted_tables` text,
	`metadata` text,
	`processing_log` text,
	`error_message` text,
	`queued_at` text,
	`processed_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `export_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text,
	`requested_by` text,
	`format` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`output_key` text,
	`expires_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`requested_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `knowledge_base_chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`kb_document_id` text NOT NULL,
	`chunk_text` text NOT NULL,
	`chunk_index` integer DEFAULT 0 NOT NULL,
	`embedding` text,
	`token_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`kb_document_id`) REFERENCES `knowledge_base_documents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `knowledge_base_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`storage_key` text NOT NULL,
	`document_type` text NOT NULL,
	`department_id` text,
	`language` text,
	`is_active` integer DEFAULT true NOT NULL,
	`version` text,
	`effective_date` text,
	`description` text,
	`uploaded_by` text,
	`chunk_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recommendations` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text,
	`title` text NOT NULL,
	`title_ar` text,
	`body` text NOT NULL,
	`evidence` text,
	`is_evidence_sufficient` integer DEFAULT true NOT NULL,
	`specificity` text DEFAULT 'specific' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`department_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `risks` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text,
	`title` text NOT NULL,
	`title_ar` text,
	`description` text,
	`severity` text DEFAULT 'medium' NOT NULL,
	`category` text,
	`status` text DEFAULT 'open' NOT NULL,
	`department_id` text,
	`owner_user_id` text,
	`due_date` text,
	`evidence` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name_en` text NOT NULL,
	`name_ar` text NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'analyst' NOT NULL,
	`department_id` text,
	`language_pref` text DEFAULT 'ar' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`last_login_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);