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
  categoriaId: integer("categoria_id"),
  videoId: text("video_id"),
});

export const comentarios = sqliteTable("comentarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  texto: text("texto").notNull(),
  usuarioId: integer("usuario_id"),
  aulaId: integer("aula_id"),
});

export const matriculas = sqliteTable("matriculas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  usuarioId: integer("usuario_id"),
  aulaId: integer("aula_id"),
});

export const favoritos = sqliteTable("favoritos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  consumidorId: integer("consumidor_id").notNull(),
  prestadorId: integer("prestador_id").notNull(),
});

export const anuncios = sqliteTable("anuncios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  preco: integer("preco").notNull(),
  prestadorId: integer("prestador_id").notNull(),
});

export const agenda = sqliteTable("agenda", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  prestadorId: integer("prestador_id").notNull(),
  data: text("data").notNull(),
  horario: text("horario").notNull(),
  disponivel: integer("disponivel").notNull().default(1),
});
