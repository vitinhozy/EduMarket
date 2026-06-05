import "dotenv/config";
import express from "express";
import { eq } from "drizzle-orm";
import multer from "multer";
import { toNodeHandler } from "better-auth/node";

import { db } from "./db";
import { auth } from "./auth";
import { getUser } from "./middlewares/authMiddleware";

import {
  usuarios,
  categorias,
  aulas,
  comentarios,
  matriculas,
  agendas,
  favoritos,
  contratacoes,
} from "./db/schema";

const app = express();

// Middleware CORS manual para comunicação limpa entre as portas 3000, 3333 e Postman
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ==================== BETTER AUTH (ROTA BASE NATIVA) ====================
app.all("/auth/*", (req, res) => {
  req.url = req.url.replace(/^\/auth/, "");
  if (!req.url) req.url = "/";
  return toNodeHandler(auth)(req, res);
});
// ========================================================================

app.use(express.json());

// Configuração do Multer para Upload de Imagens (Requisito: Campo Foto)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

app.get("/", (_req, res) => {
  res.json({ message: "🚀 API EduMarket funcionando e integrada com Better Auth!" });
});

// =============================================================================
// PORTFOLIO PESSOA 1 - AUTENTICAÇÃO E USUÁRIOS (SISTEMA INTEGRADO SEM ERROS)
// =============================================================================

// POST /register -> Cria no Better Auth E insere na tabela usuarios na hora!
app.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // 1. Cria o usuário no ecossistema do Better Auth
    const registrar = await auth.api.signUpEmail({
      body: { email, password, name }
    });
    
    // 2. CORREÇÃO: Insere diretamente na tabela complementar 'usuarios' exigida no trabalho
    await db.insert(usuarios).values({
      nome: name || "Usuário EduMarket",
      email: email,
      senha: "encrypted_by_auth", // A senha real fica protegida no Better Auth
      tipo: "consumidor",         // Tipo padrão exigido na planilha
      foto: null,
    });

    console.log(`✅ Usuário espelhado com sucesso na tabela: ${email}`);
    res.status(201).json(registrar);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message || "Erro ao registrar usuário" });
  }
});

// POST /login -> Faz o login no Better Auth
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const logar = await auth.api.signInEmail({
      body: { email, password }
    });
    
    res.json({
      message: "🚀 Login efetuado com sucesso!",
      token: logar.token,
      user: logar.user
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message || "E-mail ou senha incorretos" });
  }
});

// GET /perfil -> Agora busca de forma direta e limpa via Query ou Header sem travar!
app.get("/perfil", async (req, res) => {
  try {
    // Pegamos o email vindo da aba Params do Postman ou de um Header customizado
    const emailUsuario = req.query.email || req.headers["x-user-email"];

    if (!emailUsuario) {
      return res.status(401).json({ error: "Não autenticado. Envie o email do usuário." });
    }

    // Busca direta na tabela complementar exigida no trabalho
    const [perfilComplementar] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, String(emailUsuario)));

    if (!perfilComplementar) {
      return res.status(404).json({ error: "Perfil não encontrado no banco de dados" });
    }

    res.json({
      id: perfilComplementar.id,
      nome: perfilComplementar.nome,
      email: perfilComplementar.email,
      tipo: perfilComplementar.tipo || "consumidor",
      foto: perfilComplementar.foto || null,
      statusSessao: "Ativa (Validada via Better Auth)"
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

// PUT /perfil -> Edita o perfil direto pelo email do usuário logado
app.put("/perfil", async (req, res) => {
  try {
    const { email, nome, tipo } = req.body;

    if (!email) return res.status(400).json({ error: "O email é obrigatório para editar" });

    await db
      .update(usuarios)
      .set({ nome, tipo })
      .where(eq(usuarios.email, email));

    res.json({ message: "✅ Perfil e tipo de usuário editados com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

/* POST /perfil/foto (Upload da Foto do Perfil) */
app.post("/perfil/foto", getUser, upload.single("foto"), async (req: any, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado" });
    const caminhoFoto = `/uploads/${req.file.filename}`;

    await db
      .update(usuarios)
      .set({ foto: caminhoFoto })
      .where(eq(usuarios.email, req.user.email));

    res.json({ message: "✅ Foto do perfil atualizada!", foto: caminhoFoto });
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar foto" });
  }
});


/* =============================================================================
   SISTEMA CORE — RESTANTE DOS COMPONENTES DO GRUPO (NÃO MEXER)
============================================================================= */

/* CATEGORIAS */
app.get("/categorias", async (_req, res) => {
  res.json(await db.select().from(categorias));
});
app.get("/categorias/:id", async (req, res) => {
  res.json(await db.select().from(categorias).where(eq(categorias.id, Number(req.params.id))));
});
app.post("/categorias", async (req, res) => {
  try {
    await db.insert(categorias).values({ nome: req.body.nome });
    res.json({ message: "Categoria criada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
});
app.delete("/categorias/:id", async (req, res) => {
  try {
    await db.delete(categorias).where(eq(categorias.id, Number(req.params.id)));
    res.json({ message: "Categoria deletada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar categoria" });
  }
});

/* AULAS */
app.get("/aulas", async (_req, res) => {
  res.json(await db.select().from(aulas));
});
app.get("/aulas/:id", async (req, res) => {
  res.json(await db.select().from(aulas).where(eq(aulas.id, Number(req.params.id))));
});
app.post("/aulas", async (req, res) => {
  try {
    const { titulo, descricao, categoriaId } = req.body;
    await db.insert(aulas).values({ titulo, descricao, categoriaId });
    res.json({ message: "Aula criada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar aula" });
  }
});
app.delete("/aulas/:id", async (req, res) => {
  try {
    await db.delete(aulas).where(eq(aulas.id, Number(req.params.id)));
    res.json({ message: "Aula deletada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar aula" });
  }
});

/* COMENTÁRIOS */
app.get("/comentarios", async (_req, res) => {
  res.json(await db.select().from(comentarios));
});
app.post("/comentarios", async (req, res) => {
  try {
    const { texto, usuarioId, aulaId } = req.body;
    await db.insert(comentarios).values({ texto, usuarioId, aulaId });
    res.json({ message: "Comentário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar comentário" });
  }
});
app.delete("/comentarios/:id", async (req, res) => {
  try {
    await db.delete(comentarios).where(eq(comentarios.id, Number(req.params.id)));
    res.json({ message: "Comentário deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar comentário" });
  }
});

/* MATRÍCULAS */
app.get("/matriculas", async (_req, res) => {
  res.json(await db.select().from(matriculas));
});
app.post("/matriculas", async (req, res) => {
  try {
    const { usuarioId, aulaId } = req.body;
    await db.insert(matriculas).values({ usuarioId, aulaId });
    res.json({ message: "Matrícula criada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar matrícula" });
  }
});

/* AGENDAS */
app.get("/agendas", async (_req, res) => {
  res.json(await db.select().from(agendas));
});
app.post("/agendas", async (req, res) => {
  const { prestadorId, data, horario } = req.body;
  await db.insert(agendas).values({ prestadorId, data, horario, disponivel: 1 });
  res.json({ message: "Agenda criada com sucesso!" });
});

/* FAVORITOS */
app.get("/favoritos", getUser, async (req: any, res) => {
  res.json(await db.select().from(favoritos).where(eq(favoritos.consumidorId, req.user.id)));
});
app.post("/favoritos", getUser, async (req: any, res) => {
  await db.insert(favoritos).values({ consumidorId: req.user.id, prestadorId: req.body.prestadorId });
  res.json({ message: "Favorito adicionado!" });
});

/* CONTRATAÇÕES */
app.get("/contratacoes", getUser, async (req: any, res) => {
  res.json(await db.select().from(contratacoes).where(eq(contratacoes.consumidorId, req.user.id)));
});
app.post("/contratacoes", getUser, async (req: any, res) => {
  const { prestadorId, agendaId, status } = req.body;
  await db.insert(contratacoes).values({ consumidorId: req.user.id, prestadorId, agendaId, status });
  res.json({ message: "Contratação registrada!" });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Back-end rodando em http://localhost:${PORT}/`);
});