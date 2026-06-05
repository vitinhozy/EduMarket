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

// ==================== BETTER AUTH ====================
// IMPORTANTE: deve ficar ANTES do express.json()
// Endpoint de cadastro: POST /auth/sign-up/email
// Endpoint de login:    POST /auth/sign-in/email
// Endpoint de sessão:   GET  /auth/get-session
// TODO: se continuar dando 404, tentar substituir por:
// app.use("/auth", toNodeHandler(auth));
const authHandler = toNodeHandler(auth);
app.use((req, res, next) => {
  if (req.path.startsWith("/auth")) {
    return authHandler(req, res, next);
  }
  next();
});
// =====================================================

app.use(express.json());

app.get("/me", getUser, (req: any, res) => {
  res.json(req.user);
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

/* =====================================================
   TESTE API
===================================================== */
app.get("/", (_req, res) => {
  res.json({ message: "🚀 API funcionando!" });
});

/* =====================================================
   USUÁRIOS
===================================================== */
app.get("/usuarios", async (_req, res) => {
  const listaUsuarios = await db.select().from(usuarios);
  res.json(listaUsuarios);
});

app.get("/usuarios/:id", async (req, res) => {
  const id = Number(req.params.id);
  const usuario = await db.select().from(usuarios).where(eq(usuarios.id, id));
  res.json(usuario);
});

app.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    await db.insert(usuarios).values({ nome, email, senha, tipo });
    res.json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário", details: error });
  }
});

app.put("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, email, senha } = req.body;
    await db.update(usuarios).set({ nome, email, senha }).where(eq(usuarios.id, id));
    res.json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(usuarios).where(eq(usuarios.id, id));
    res.json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

/* =====================================================
   CATEGORIAS
===================================================== */
app.get("/categorias", async (_req, res) => {
  const lista = await db.select().from(categorias);
  res.json(lista);
});

app.get("/categorias/:id", async (req, res) => {
  const id = Number(req.params.id);
  const categoria = await db.select().from(categorias).where(eq(categorias.id, id));
  res.json(categoria);
});

app.post("/categorias", async (req, res) => {
  try {
    const { nome } = req.body;
    await db.insert(categorias).values({ nome });
    res.json({ message: "Categoria criada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
});

app.put("/categorias/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome } = req.body;
    await db.update(categorias).set({ nome }).where(eq(categorias.id, id));
    res.json({ message: "Categoria atualizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
});

app.delete("/categorias/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(categorias).where(eq(categorias.id, id));
    res.json({ message: "Categoria deletada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar categoria" });
  }
});

/* =====================================================
   AULAS
===================================================== */
app.get("/aulas", async (_req, res) => {
  const lista = await db.select().from(aulas);
  res.json(lista);
});

app.get("/aulas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const aula = await db.select().from(aulas).where(eq(aulas.id, id));
  res.json(aula);
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

app.put("/aulas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { titulo, descricao, categoriaId } = req.body;
    await db.update(aulas).set({ titulo, descricao, categoriaId }).where(eq(aulas.id, id));
    res.json({ message: "Aula atualizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar aula" });
  }
});

app.delete("/aulas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(aulas).where(eq(aulas.id, id));
    res.json({ message: "Aula deletada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar aula" });
  }
});

/* =====================================================
   COMENTÁRIOS
===================================================== */
app.get("/comentarios", async (_req, res) => {
  const lista = await db.select().from(comentarios);
  res.json(lista);
});

app.get("/comentarios/:id", async (req, res) => {
  const id = Number(req.params.id);
  const comentario = await db.select().from(comentarios).where(eq(comentarios.id, id));
  res.json(comentario);
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

app.put("/comentarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { texto, usuarioId, aulaId } = req.body;
    await db.update(comentarios).set({ texto, usuarioId, aulaId }).where(eq(comentarios.id, id));
    res.json({ message: "Comentário atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar comentário" });
  }
});

app.delete("/comentarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(comentarios).where(eq(comentarios.id, id));
    res.json({ message: "Comentário deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar comentário" });
  }
});

/* =====================================================
   MATRÍCULAS
===================================================== */
app.get("/matriculas", async (_req, res) => {
  const lista = await db.select().from(matriculas);
  res.json(lista);
});

app.get("/matriculas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const matricula = await db.select().from(matriculas).where(eq(matriculas.id, id));
  res.json(matricula);
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

app.put("/matriculas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { usuarioId, aulaId } = req.body;
    await db.update(matriculas).set({ usuarioId, aulaId }).where(eq(matriculas.id, id));
    res.json({ message: "Matrícula atualizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar matrícula" });
  }
});

app.delete("/matriculas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(matriculas).where(eq(matriculas.id, id));
    res.json({ message: "Matrícula deletada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar matrícula" });
  }
});

/* =====================================================
   AGENDAS
===================================================== */
app.get("/agendas", async (_req, res) => {
  const lista = await db.select().from(agendas);
  res.json(lista);
});

app.post("/agendas", async (req, res) => {
  const { prestadorId, data, horario } = req.body;
  await db.insert(agendas).values({ prestadorId, data, horario, disponivel: 1 });
  res.json({ message: "Agenda criada com sucesso!" });
});

app.put("/agendas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { data, horario, disponivel } = req.body;
  await db.update(agendas).set({ data, horario, disponivel }).where(eq(agendas.id, id));
  res.json({ message: "Agenda atualizada com sucesso!" });
});

app.delete("/agendas/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(agendas).where(eq(agendas.id, id));
  res.json({ message: "Agenda removida com sucesso!" });
});

/* =====================================================
   FAVORITOS
===================================================== */
app.get("/favoritos", getUser, async (req: any, res) => {
  const userId = req.user.id;
  const lista = await db.select().from(favoritos).where(eq(favoritos.consumidorId, userId));
  res.json(lista);
});

app.post("/favoritos", getUser, async (req: any, res) => {
  const userId = req.user.id;
  const { prestadorId } = req.body;
  await db.insert(favoritos).values({ consumidorId: userId, prestadorId });
  res.json({ message: "Favorito adicionado!" });
});

app.delete("/favoritos/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(favoritos).where(eq(favoritos.id, id));
  res.json({ message: "Favorito removido!" });
});

/* =====================================================
   CONTRATAÇÕES
===================================================== */
app.get("/contratacoes", getUser, async (req: any, res) => {
  const userId = req.user.id;
  const lista = await db.select().from(contratacoes).where(eq(contratacoes.consumidorId, userId));
  res.json(lista);
});

app.post("/contratacoes", getUser, async (req: any, res) => {
  const userId = req.user.id;
  const { prestadorId, agendaId, status } = req.body;
  await db.insert(contratacoes).values({ consumidorId: userId, prestadorId, agendaId, status });
  res.json({ message: "Contratação registrada!" });
});

app.put("/contratacoes/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  await db.update(contratacoes).set({ status }).where(eq(contratacoes.id, id));
  res.json({ message: "Status atualizado!" });
});

/* =====================================================
   UPLOAD FOTO PERFIL
===================================================== */
app.post("/upload/:id", upload.single("foto"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }
    const caminhoFoto = `/uploads/${req.file.filename}`;
    await db.update(usuarios).set({ foto: caminhoFoto }).where(eq(usuarios.id, id));
    res.json({ message: "Foto enviada com sucesso!", foto: caminhoFoto });
  } catch (error) {
    res.status(500).json({ error: "Erro ao enviar foto" });
  }
});

/* =====================================================
   START SERVER
===================================================== */
app.listen(3333, () => {
  console.log("🚀 Server running on http://localhost:3333/");
});