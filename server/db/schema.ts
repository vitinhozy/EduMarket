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

/* =========================
   TABELA AGENDAS
========================= */
export const agendas = sqliteTable("agendas", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  prestadorId: integer("prestador_id").notNull(),

  dataHora: text("data_hora").notNull(), // ISO 8601: "2025-06-10T14:00:00"

  disponivel: integer("disponivel", { mode: "boolean" }).notNull().default(true),
});

/* =========================
   TABELA CONTRATAÇÕES
========================= */
export const contratacoes = sqliteTable("contratacoes", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  consumidorId: integer("consumidor_id").notNull(),

  prestadorId: integer("prestador_id").notNull(),

  anuncioId: integer("anuncio_id").notNull(),

  agendaId: integer("agenda_id").notNull(),

  // "pendente" | "confirmada" | "cancelada" | "concluida"
  status: text("status").notNull().default("pendente"),

  valor: integer("valor").notNull(), // em centavos (ex: 5000 = R$50,00)
});

/* =========================
   TABELA PAGAMENTOS
========================= */
export const pagamentos = sqliteTable("pagamentos", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  contratacaoId: integer("contratacao_id").notNull(),

  // "pix" | "cartao_credito" | "cartao_debito" | "boleto"
  metodo: text("metodo").notNull(),

  // "pendente" | "aprovado" | "recusado" | "estornado"
  status: text("status").notNull().default("pendente"),

  valor: integer("valor").notNull(), // em centavos

  criadoEm: text("criado_em").notNull(),
});