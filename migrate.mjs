import { createClient } from "@libsql/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "database.db");

const client = createClient({ url: `file:${DB_PATH}` });

await client.execute(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  senha TEXT NOT NULL
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  nome TEXT NOT NULL
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS aulas (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  usuario_id INTEGER,
  categoria_id INTEGER
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS comentarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  texto TEXT NOT NULL,
  usuario_id INTEGER,
  aula_id INTEGER
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS matriculas (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  usuario_id INTEGER,
  aula_id INTEGER
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS favoritos (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  consumidor_id INTEGER NOT NULL,
  prestador_id INTEGER NOT NULL
)`);


await client.execute(`CREATE TABLE IF NOT EXISTS anuncios (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  preco INTEGER NOT NULL,
  prestador_id INTEGER NOT NULL
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS agenda (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  prestador_id INTEGER NOT NULL,
  data TEXT NOT NULL,
  horario TEXT NOT NULL,
  disponivel INTEGER NOT NULL DEFAULT 1
)`);

console.log(`✅ Banco criado em: ${DB_PATH}`);
client.close();
