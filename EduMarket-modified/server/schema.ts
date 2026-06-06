import { sqliteTable, integer, text, real, uniqueIndex } from "drizzle-orm/sqlite-core";

/* =========================
   TABELA USUÁRIOS
========================= */
export const usuarios = sqliteTable("usuarios", {
  id:    integer("id").primaryKey({ autoIncrement: true }),
  nome:  text("nome").notNull(),
  email: text("email").notNull().unique(),
  senha: text("senha").notNull(),
});

/* =========================
   TABELA CATEGORIAS
========================= */
export const categorias = sqliteTable("categorias", {
  id:   integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
});

/* =========================
   TABELA AULAS
========================= */
export const aulas = sqliteTable("aulas", {
  id:          integer("id").primaryKey({ autoIncrement: true }),
  titulo:      text("titulo").notNull(),
  descricao:   text("descricao").notNull(),
  categoriaId: integer("categoria_id").notNull(),
});

/* =========================
   TABELA COMENTÁRIOS
========================= */
export const comentarios = sqliteTable("comentarios", {
  id:        integer("id").primaryKey({ autoIncrement: true }),
  texto:     text("texto").notNull(),
  usuarioId: integer("usuario_id").notNull(),
  aulaId:    integer("aula_id").notNull(),
});

/* =========================
   TABELA MATRÍCULAS
========================= */
export const matriculas = sqliteTable("matriculas", {
  id:        integer("id").primaryKey({ autoIncrement: true }),
  usuarioId: integer("usuario_id").notNull(),
  aulaId:    integer("aula_id").notNull(),
});

/* =========================
   TABELA FAVORITOS
   unique: consumidor não pode favoritar o mesmo prestador duas vezes
========================= */
export const favoritos = sqliteTable("favoritos", {
  id:          integer("id").primaryKey({ autoIncrement: true }),
  consumidorId: integer("consumidor_id").notNull(),
  prestadorId:  integer("prestador_id").notNull(),
}, (t) => ({
  uniqFavorito: uniqueIndex("uniq_favorito").on(t.consumidorId, t.prestadorId),
}));

/* =========================
   TABELA ANÚNCIOS
========================= */
export const anuncios = sqliteTable("anuncios", {
  id:          integer("id").primaryKey({ autoIncrement: true }),
  titulo:      text("titulo").notNull(),
  descricao:   text("descricao").notNull(),
  preco:       real("preco").notNull(),
  prestadorId: integer("prestador_id").notNull(),
});

/* =========================
   TABELA AGENDA
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
