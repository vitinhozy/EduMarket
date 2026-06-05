CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`nome` text NOT NULL,
	`tipo` text NOT NULL,
	`foto` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_user_id_unique` ON `profiles` (`user_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_agendas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`prestador_id` text NOT NULL,
	`data` text NOT NULL,
	`horario` text NOT NULL,
	`disponivel` integer DEFAULT 1
);
--> statement-breakpoint
INSERT INTO `__new_agendas`("id", "prestador_id", "data", "horario", "disponivel") SELECT "id", "prestador_id", "data", "horario", "disponivel" FROM `agendas`;--> statement-breakpoint
DROP TABLE `agendas`;--> statement-breakpoint
ALTER TABLE `__new_agendas` RENAME TO `agendas`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_aulas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`descricao` text NOT NULL,
	`usuario_id` text,
	`categoria_id` integer
);
--> statement-breakpoint
INSERT INTO `__new_aulas`("id", "titulo", "descricao", "usuario_id", "categoria_id") SELECT "id", "titulo", "descricao", "usuario_id", "categoria_id" FROM `aulas`;--> statement-breakpoint
DROP TABLE `aulas`;--> statement-breakpoint
ALTER TABLE `__new_aulas` RENAME TO `aulas`;--> statement-breakpoint
CREATE TABLE `__new_comentarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`texto` text NOT NULL,
	`usuario_id` text,
	`aula_id` integer
);
--> statement-breakpoint
INSERT INTO `__new_comentarios`("id", "texto", "usuario_id", "aula_id") SELECT "id", "texto", "usuario_id", "aula_id" FROM `comentarios`;--> statement-breakpoint
DROP TABLE `comentarios`;--> statement-breakpoint
ALTER TABLE `__new_comentarios` RENAME TO `comentarios`;--> statement-breakpoint
CREATE TABLE `__new_contratacoes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`consumidor_id` text NOT NULL,
	`prestador_id` text NOT NULL,
	`agenda_id` integer NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_contratacoes`("id", "consumidor_id", "prestador_id", "agenda_id", "status") SELECT "id", "consumidor_id", "prestador_id", "agenda_id", "status" FROM `contratacoes`;--> statement-breakpoint
DROP TABLE `contratacoes`;--> statement-breakpoint
ALTER TABLE `__new_contratacoes` RENAME TO `contratacoes`;--> statement-breakpoint
CREATE TABLE `__new_favoritos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`consumidor_id` text NOT NULL,
	`prestador_id` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_favoritos`("id", "consumidor_id", "prestador_id") SELECT "id", "consumidor_id", "prestador_id" FROM `favoritos`;--> statement-breakpoint
DROP TABLE `favoritos`;--> statement-breakpoint
ALTER TABLE `__new_favoritos` RENAME TO `favoritos`;--> statement-breakpoint
CREATE TABLE `__new_matriculas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`usuario_id` text,
	`aula_id` integer
);
--> statement-breakpoint
INSERT INTO `__new_matriculas`("id", "usuario_id", "aula_id") SELECT "id", "usuario_id", "aula_id" FROM `matriculas`;--> statement-breakpoint
DROP TABLE `matriculas`;--> statement-breakpoint
ALTER TABLE `__new_matriculas` RENAME TO `matriculas`;