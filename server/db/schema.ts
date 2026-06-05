import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";


export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});



export const usuarios = sqliteTable("usuarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senha: text("senha").notNull(),
  tipo: text("tipo").notNull(),
  foto: text("foto"),
});

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().unique(),
  nome: text("nome").notNull(),
  tipo: text("tipo").notNull(),
  foto: text("foto"),
});

export const categorias = sqliteTable("categorias", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
});

export const aulas = sqliteTable("aulas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  usuarioId: text("usuario_id"),
  categoriaId: integer("categoria_id"),
});

export const comentarios = sqliteTable("comentarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  texto: text("texto").notNull(),
  usuarioId: text("usuario_id"),
  aulaId: integer("aula_id"),
});

export const matriculas = sqliteTable("matriculas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  usuarioId: text("usuario_id"),
  aulaId: integer("aula_id"),
});

export const agendas = sqliteTable("agendas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  prestadorId: text("prestador_id").notNull(),
  data: text("data").notNull(),
  horario: text("horario").notNull(),
  disponivel: integer("disponivel").default(1),
});

export const favoritos = sqliteTable("favoritos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  consumidorId: text("consumidor_id").notNull(),
  prestadorId: text("prestador_id").notNull(),
});

export const contratacoes = sqliteTable("contratacoes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  consumidorId: text("consumidor_id").notNull(),
  prestadorId: text("prestador_id").notNull(),
  agendaId: integer("agenda_id").notNull(),
  status: text("status").notNull(),
});