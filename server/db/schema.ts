import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const usuarios = sqliteTable("usuarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  senha: text("senha").notNull(),
});

export const categorias = sqliteTable("categorias", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
});

export const aulas = sqliteTable("aulas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  usuario_id: integer("usuario_id"),
  categoria_id: integer("categoria_id"),
});

export const comentarios = sqliteTable("comentarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  texto: text("texto").notNull(),
  usuario_id: integer("usuario_id"),
  aula_id: integer("aula_id"),
});

export const matriculas = sqliteTable("matriculas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  usuario_id: integer("usuario_id"),
  aula_id: integer("aula_id"),
});