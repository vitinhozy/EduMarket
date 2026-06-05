CREATE TABLE `agendas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`prestador_id` integer NOT NULL,
	`data` text NOT NULL,
	`horario` text NOT NULL,
	`disponivel` integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE `contratacoes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`consumidor_id` integer NOT NULL,
	`prestador_id` integer NOT NULL,
	`agenda_id` integer NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `favoritos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`consumidor_id` integer NOT NULL,
	`prestador_id` integer NOT NULL
);
