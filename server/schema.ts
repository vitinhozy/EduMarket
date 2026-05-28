import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

/* =========================
   TABELA USUÁRIOS
========================= */
export const usuarios = sqliteTable("usuarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  nome: text("nome").notNull(),

  email: text("email").notNull(),

  senha: text("senha").notNull(),
});

/* =========================
   TABELA CATEGORIAS
========================= */
export const categorias = sqliteTable("categorias", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  nome: text("nome").notNull(),
});

/* =========================
   TABELA AULAS
========================= */
export const aulas = sqliteTable("aulas", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  titulo: text("titulo").notNull(),

  descricao: text("descricao").notNull(),

  categoriaId: integer("categoria_id").notNull(),
});

/* =========================
   TABELA COMENTÁRIOS
========================= */
export const comentarios = sqliteTable("comentarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  texto: text("texto").notNull(),

  usuarioId: integer("usuario_id").notNull(),

  aulaId: integer("aula_id").notNull(),
});

/* =========================
   TABELA MATRÍCULAS
========================= */
export const matriculas = sqliteTable("matriculas", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  usuarioId: integer("usuario_id").notNull(),

  aulaId: integer("aula_id").notNull(),
});