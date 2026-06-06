import { createClient } from "@libsql/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const DB_PATH    = path.resolve(__dirname, "database.db");

const client = createClient({ url: `file:${DB_PATH}` });

await client.execute(`CREATE TABLE IF NOT EXISTS usuarios (
  id    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  nome  TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS categorias (
  id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  nome TEXT NOT NULL
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS aulas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  titulo       TEXT NOT NULL,
  descricao    TEXT NOT NULL,
  usuario_id   INTEGER,
  categoria_id INTEGER
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS comentarios (
  id         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  texto      TEXT NOT NULL,
  usuario_id INTEGER,
  aula_id    INTEGER
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS matriculas (
  id         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  usuario_id INTEGER,
  aula_id    INTEGER
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS favoritos (
  id            INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  consumidor_id INTEGER NOT NULL,
  prestador_id  INTEGER NOT NULL,
  UNIQUE(consumidor_id, prestador_id)
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS anuncios (
  id           INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  titulo       TEXT NOT NULL,
  descricao    TEXT NOT NULL,
  preco        REAL NOT NULL,
  prestador_id INTEGER NOT NULL
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS agenda (
  id           INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  prestador_id INTEGER NOT NULL,
  data         TEXT NOT NULL,
  horario      TEXT NOT NULL,
  disponivel   INTEGER NOT NULL DEFAULT 1,
  UNIQUE(prestador_id, data, horario)
)`);


// Seed: Cursos de exemplo para demonstração
const cursosExistentes = await client.execute(`SELECT COUNT(*) as total FROM anuncios`);
const total = cursosExistentes.rows[0].total;

if (Number(total) === 0) {
  const cursos = [
    { titulo: 'Desenvolvimento Web Completo', descricao: 'HTML, CSS, JavaScript, React e Node.js do zero ao avançado', preco: 99.90, prestador_id: 1 },
    { titulo: 'Python para Data Science', descricao: 'Aprenda Python, Pandas, NumPy e Machine Learning na prática', preco: 119.90, prestador_id: 1 },
    { titulo: 'UI/UX Design na Prática', descricao: 'Figma, prototipação e design de interfaces profissionais', preco: 89.90, prestador_id: 1 },
    { titulo: 'Flutter & Dart Mobile', descricao: 'Crie apps para iOS e Android com Flutter do iniciante ao avançado', preco: 109.90, prestador_id: 1 },
    { titulo: 'DevOps e Docker', descricao: 'Docker, Kubernetes, CI/CD e infraestrutura em nuvem', preco: 129.90, prestador_id: 1 },
    { titulo: 'Banco de Dados SQL e NoSQL', descricao: 'PostgreSQL, MongoDB e Redis com projetos reais', preco: 79.90, prestador_id: 1 },
  ];

  for (const curso of cursos) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO anuncios (titulo, descricao, preco, prestador_id) VALUES (?, ?, ?, ?)`,
      args: [curso.titulo, curso.descricao, curso.preco, curso.prestador_id],
    });
  }
  console.log("✅ Cursos de exemplo inseridos!");
} else {
  console.log("ℹ️  Cursos já existem, pulando seed.");
}

console.log(`✅ Banco criado em: ${DB_PATH}`);
client.close();
