CREATE TABLE `aulas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`descricao` text NOT NULL,
	`usuario_id` integer,
	`categoria_id` integer
);
--> statement-breakpoint
CREATE TABLE `categorias` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comentarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`texto` text NOT NULL,
	`usuario_id` integer,
	`aula_id` integer
);
--> statement-breakpoint
CREATE TABLE `matriculas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`usuario_id` integer,
	`aula_id` integer
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`senha` text NOT NULL
);
