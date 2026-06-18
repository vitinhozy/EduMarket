import { createClient } from "@libsql/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
<<<<<<< HEAD
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "database.db");
=======
const __dirname  = path.dirname(__filename);
const DB_PATH    = path.resolve(__dirname, "database.db");
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328

const client = createClient({ url: `file:${DB_PATH}` });

await client.execute(`CREATE TABLE IF NOT EXISTS usuarios (
<<<<<<< HEAD
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
=======
  id    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  nome  TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  senha TEXT NOT NULL
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS categorias (
<<<<<<< HEAD
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
=======
  id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  nome TEXT NOT NULL
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS aulas (
<<<<<<< HEAD
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  usuario_id INTEGER,
=======
  id           INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  titulo       TEXT NOT NULL,
  descricao    TEXT NOT NULL,
  usuario_id   INTEGER,
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  categoria_id INTEGER
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS comentarios (
<<<<<<< HEAD
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
=======
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
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  prestador_id INTEGER NOT NULL
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS agenda (
<<<<<<< HEAD
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  prestador_id INTEGER NOT NULL,
  data TEXT NOT NULL,
  horario TEXT NOT NULL,
  disponivel INTEGER NOT NULL DEFAULT 1
)`);

=======
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

>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
console.log(`✅ Banco criado em: ${DB_PATH}`);
client.close();
