<<<<<<< HEAD
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
=======
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328

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

export const favoritos = sqliteTable("favoritos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  consumidor_id: integer("consumidor_id").notNull(),
  prestador_id: integer("prestador_id").notNull(),
});

export const anuncios = sqliteTable("anuncios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
<<<<<<< HEAD
  preco: integer("preco").notNull(),
=======
  preco: real("preco").notNull(),
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  prestador_id: integer("prestador_id").notNull(),
});

export const agenda = sqliteTable("agenda", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  prestador_id: integer("prestador_id").notNull(),
  data: text("data").notNull(),
  horario: text("horario").notNull(),
  disponivel: integer("disponivel").notNull().default(1),
});
