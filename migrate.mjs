import { createClient } from "@libsql/client";

const client = createClient({ url: "file:database.db" });

const statements = [
  // Tabelas
  `CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    senha TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS aulas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    categoria_id INTEGER NOT NULL,
    video_id TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT NOT NULL,
    usuario_id INTEGER NOT NULL,
    aula_id INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS matriculas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    aula_id INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consumidor_id INTEGER NOT NULL,
    prestador_id INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS anuncios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    preco INTEGER NOT NULL,
    prestador_id INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS agenda (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prestador_id INTEGER NOT NULL,
    data TEXT NOT NULL,
    horario TEXT NOT NULL,
    disponivel INTEGER NOT NULL DEFAULT 1
  )`,

  // Adicionar video_id caso a tabela aulas já exista sem essa coluna
  `ALTER TABLE aulas ADD COLUMN video_id TEXT`,

  // Categorias
  `INSERT OR IGNORE INTO categorias (id, nome) VALUES (1, 'Programação Web')`,
  `INSERT OR IGNORE INTO categorias (id, nome) VALUES (2, 'Data Science')`,
  `INSERT OR IGNORE INTO categorias (id, nome) VALUES (3, 'Design')`,
  `INSERT OR IGNORE INTO categorias (id, nome) VALUES (4, 'Mobile')`,
  `INSERT OR IGNORE INTO categorias (id, nome) VALUES (5, 'DevOps')`,
  `INSERT OR IGNORE INTO categorias (id, nome) VALUES (6, 'Banco de Dados')`,

  // Aulas com videoId do YouTube
  `INSERT OR IGNORE INTO aulas (id, titulo, descricao, categoria_id, video_id)
   VALUES (1, 'Desenvolvimento Web Completo', 'Aprenda HTML, CSS, JavaScript e muito mais neste curso completo de desenvolvimento web do zero ao profissional.', 1, 'SqcY0GlETPk')`,
  `INSERT OR IGNORE INTO aulas (id, titulo, descricao, categoria_id, video_id)
   VALUES (2, 'Python para Data Science', 'Domine Python aplicado à ciência de dados, análise estatística, visualização e machine learning.', 2, 'rfscVS0vtbw')`,
  `INSERT OR IGNORE INTO aulas (id, titulo, descricao, categoria_id, video_id)
   VALUES (3, 'UI/UX Design na Prática', 'Aprenda a criar interfaces modernas e experiências de usuário incríveis com ferramentas profissionais.', 3, 'lHOlAEAMIX0')`,
  `INSERT OR IGNORE INTO aulas (id, titulo, descricao, categoria_id, video_id)
   VALUES (4, 'Flutter & Dart Mobile', 'Desenvolva aplicativos mobile multiplataforma para iOS e Android com Flutter e Dart.', 4, 'VPvVD8t02U8')`,
  `INSERT OR IGNORE INTO aulas (id, titulo, descricao, categoria_id, video_id)
   VALUES (5, 'DevOps e Docker', 'Aprenda Docker, CI/CD, Kubernetes e as melhores práticas de DevOps para o mercado.', 5, 'Wvf0mBNGjXY')`,
  `INSERT OR IGNORE INTO aulas (id, titulo, descricao, categoria_id, video_id)
   VALUES (6, 'Banco de Dados SQL e NoSQL', 'Domine bancos de dados relacionais e não relacionais, desde fundamentos até otimização avançada.', 6, 'HXV3zeQKqGY')`,

  // Anúncios — títulos compatíveis com as chaves do dicionário VIDEOS em MeusCursos.tsx
  `INSERT OR IGNORE INTO anuncios (id, titulo, descricao, preco, prestador_id)
   VALUES (1, 'Desenvolvimento Web Completo', 'Aprenda HTML, CSS, JavaScript, React e Node.js do zero ao profissional.', 9990, 1)`,
  `INSERT OR IGNORE INTO anuncios (id, titulo, descricao, preco, prestador_id)
   VALUES (2, 'Python para Data Science', 'Domine Pandas, NumPy e Machine Learning com projetos práticos.', 11990, 1)`,
  `INSERT OR IGNORE INTO anuncios (id, titulo, descricao, preco, prestador_id)
   VALUES (3, 'UI/UX Design na Prática', 'Figma, prototipação e design de interfaces modernas.', 8990, 1)`,
  `INSERT OR IGNORE INTO anuncios (id, titulo, descricao, preco, prestador_id)
   VALUES (4, 'Flutter & Dart Mobile', 'Desenvolva apps iOS e Android do zero com Flutter.', 10990, 1)`,
  `INSERT OR IGNORE INTO anuncios (id, titulo, descricao, preco, prestador_id)
   VALUES (5, 'DevOps e Docker', 'Docker, Kubernetes e pipelines CI/CD na prática.', 12990, 1)`,
  `INSERT OR IGNORE INTO anuncios (id, titulo, descricao, preco, prestador_id)
   VALUES (6, 'Banco de Dados SQL e NoSQL', 'PostgreSQL, MongoDB e Redis do básico ao avançado.', 7990, 1)`,
];

let criadas = 0;
let ignoradas = 0;

for (const sql of statements) {
  try {
    await client.execute({ sql, args: [] });
    criadas++;
  } catch (err) {
    // ALTER TABLE falha se coluna já existe — ignorar silenciosamente
    if (err.message?.includes('duplicate column') || err.message?.includes('already exists')) {
      ignoradas++;
    } else {
      console.warn(`⚠️  Aviso: ${err.message}`);
      ignoradas++;
    }
  }
}

console.log(`✅ Migração concluída! ${criadas} operações executadas, ${ignoradas} ignoradas.`);
client.close();
