<<<<<<< HEAD
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
=======
import { sqliteTable, integer, text, real, uniqueIndex } from "drizzle-orm/sqlite-core";
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328

/* =========================
   TABELA USUÁRIOS
========================= */
export const usuarios = sqliteTable("usuarios", {
<<<<<<< HEAD
  id: integer("id").primaryKey({ autoIncrement: true }),

  nome: text("nome").notNull(),

  email: text("email").notNull(),

=======
  id:    integer("id").primaryKey({ autoIncrement: true }),
  nome:  text("nome").notNull(),
  email: text("email").notNull().unique(),
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  senha: text("senha").notNull(),
});

/* =========================
   TABELA CATEGORIAS
========================= */
export const categorias = sqliteTable("categorias", {
<<<<<<< HEAD
  id: integer("id").primaryKey({ autoIncrement: true }),

=======
  id:   integer("id").primaryKey({ autoIncrement: true }),
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  nome: text("nome").notNull(),
});

/* =========================
   TABELA AULAS
========================= */
export const aulas = sqliteTable("aulas", {
<<<<<<< HEAD
  id: integer("id").primaryKey({ autoIncrement: true }),

  titulo: text("titulo").notNull(),

  descricao: text("descricao").notNull(),

=======
  id:          integer("id").primaryKey({ autoIncrement: true }),
  titulo:      text("titulo").notNull(),
  descricao:   text("descricao").notNull(),
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  categoriaId: integer("categoria_id").notNull(),
});

/* =========================
   TABELA COMENTÁRIOS
========================= */
export const comentarios = sqliteTable("comentarios", {
<<<<<<< HEAD
  id: integer("id").primaryKey({ autoIncrement: true }),

  texto: text("texto").notNull(),

  usuarioId: integer("usuario_id").notNull(),

  aulaId: integer("aula_id").notNull(),
=======
  id:        integer("id").primaryKey({ autoIncrement: true }),
  texto:     text("texto").notNull(),
  usuarioId: integer("usuario_id").notNull(),
  aulaId:    integer("aula_id").notNull(),
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
});

/* =========================
   TABELA MATRÍCULAS
========================= */
export const matriculas = sqliteTable("matriculas", {
<<<<<<< HEAD
  id: integer("id").primaryKey({ autoIncrement: true }),

  usuarioId: integer("usuario_id").notNull(),

  aulaId: integer("aula_id").notNull(),
=======
  id:        integer("id").primaryKey({ autoIncrement: true }),
  usuarioId: integer("usuario_id").notNull(),
  aulaId:    integer("aula_id").notNull(),
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
});

/* =========================
   TABELA FAVORITOS
<<<<<<< HEAD
========================= */
export const favoritos = sqliteTable("favoritos", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  consumidorId: integer("consumidor_id").notNull(),

  prestadorId: integer("prestador_id").notNull(),
});
=======
   unique: consumidor não pode favoritar o mesmo prestador duas vezes
========================= */
export const favoritos = sqliteTable("favoritos", {
  id:          integer("id").primaryKey({ autoIncrement: true }),
  consumidorId: integer("consumidor_id").notNull(),
  prestadorId:  integer("prestador_id").notNull(),
}, (t) => ({
  uniqFavorito: uniqueIndex("uniq_favorito").on(t.consumidorId, t.prestadorId),
}));
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328

/* =========================
   TABELA ANÚNCIOS
========================= */
export const anuncios = sqliteTable("anuncios", {
<<<<<<< HEAD
  id: integer("id").primaryKey({ autoIncrement: true }),

  titulo: text("titulo").notNull(),

  descricao: text("descricao").notNull(),

  preco: integer("preco").notNull(),

=======
  id:          integer("id").primaryKey({ autoIncrement: true }),
  titulo:      text("titulo").notNull(),
  descricao:   text("descricao").notNull(),
  preco:       real("preco").notNull(),
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  prestadorId: integer("prestador_id").notNull(),
});

/* =========================
   TABELA AGENDA
<<<<<<< HEAD
========================= */
export const agenda = sqliteTable("agenda", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  prestadorId: integer("prestador_id").notNull(),

  data: text("data").notNull(),

  horario: text("horario").notNull(),

  disponivel: integer("disponivel").notNull().default(1),
});
=======
   unique: prestador não pode ter dois slots no mesmo dia e horário
========================= */
export const agenda = sqliteTable("agenda", {
  id:          integer("id").primaryKey({ autoIncrement: true }),
  prestadorId: integer("prestador_id").notNull(),
  data:        text("data").notNull(),
  horario:     text("horario").notNull(),
  disponivel:  integer("disponivel").notNull().default(1),
}, (t) => ({
  uniqSlot: uniqueIndex("uniq_slot").on(t.prestadorId, t.data, t.horario),
}));
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
