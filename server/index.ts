import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { eq } from "drizzle-orm";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Stripe from "stripe";

import { db } from "./db/index.js";
import {
  usuarios, categorias, aulas, comentarios,
  matriculas, favoritos, anuncios, agenda,
} from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID     ?? "387770715916-mdkhq8j4r9gjl3qttaa2kcfdlt39a9j3.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "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";
const SESSION_SECRET       = process.env.SESSION_SECRET       ?? "edumarket-secret-key";
const STRIPE_SECRET_KEY    = process.env.STRIPE_SECRET_KEY    ?? "sk_test_51TfH7v5AWcMnv5shxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

const stripe = new Stripe(STRIPE_SECRET_KEY);

async function startServer() {
  const app    = express();
  const server = createServer(app);

  app.use(express.json());
  app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3333/auth/google/callback",
  }, async (_at, _rt, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value ?? "";
      const nome  = profile.displayName ?? "";
      const lista = await db.select().from(usuarios).where(eq(usuarios.email, email));
      if (lista.length > 0) return done(null, lista[0]);
      await db.insert(usuarios).values({ nome, email, senha: "google-oauth" });
      const novo = await db.select().from(usuarios).where(eq(usuarios.email, email));
      return done(null, novo[0]);
    } catch (err) { return done(err); }
  }));

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const lista = await db.select().from(usuarios).where(eq(usuarios.id, id));
      done(null, lista[0] ?? null);
    } catch (err) { done(err); }
  });

  /* ── OAUTH ── */
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      const user = req.user as any;
      res.redirect(`http://localhost:3000/auth/success?id=${user.id}&nome=${encodeURIComponent(user.nome)}&email=${encodeURIComponent(user.email)}`);
    }
  );

  /* ── STRIPE ── */
  app.post("/api/stripe/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "brl", description } = req.body;
      if (!amount || amount <= 0) {
        res.status(400).json({ error: "Valor inválido" });
        return;
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // centavos
        currency,
        description,
        automatic_payment_methods: { enabled: true },
      });
      res.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
    } catch (err: any) {
      console.error("Stripe error:", err.message);
      res.status(500).json({ error: err.message || "Erro ao processar pagamento" });
    }
  });

  /* ── USUÁRIOS ── */
  app.get("/api/usuarios", async (_req, res) => {
    res.json(await db.select().from(usuarios));
  });

  app.get("/api/usuarios/:id", async (req, res) => {
    const id = Number(req.params.id);
    res.json(await db.select().from(usuarios).where(eq(usuarios.id, id)));
  });

  app.post("/api/usuarios", async (req, res) => {
    try {
      const { nome, email, senha } = req.body;
      if (!nome || !email || !senha) {
        res.status(400).json({ error: "Nome, email e senha são obrigatórios" }); return;
      }
      const existente = await db.select().from(usuarios).where(eq(usuarios.email, email));
      if (existente.length > 0) {
        res.status(409).json({ error: "Este email já está cadastrado" }); return;
      }
      await db.insert(usuarios).values({ nome, email, senha });
      const criado = await db.select().from(usuarios).where(eq(usuarios.email, email));
      res.status(201).json({ message: "Usuário criado com sucesso!", usuario: criado[0] });
    } catch (err) { console.error(err); res.status(500).json({ error: "Erro ao criar usuário" }); }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) { res.status(400).json({ error: "Email e senha obrigatórios" }); return; }
      const lista = await db.select().from(usuarios).where(eq(usuarios.email, email));
      if (lista.length === 0 || lista[0].senha !== senha) {
        res.status(401).json({ error: "Email ou senha incorretos" }); return;
      }
      res.json({ usuario: { id: lista[0].id, nome: lista[0].nome, email: lista[0].email } });
    } catch (err) { console.error(err); res.status(500).json({ error: "Erro ao fazer login" }); }
  });

  app.put("/api/usuarios/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { nome, email, senha } = req.body;
      await db.update(usuarios).set({ nome, email, senha }).where(eq(usuarios.id, id));
      res.json({ message: "Usuário atualizado!" });
    } catch (err) { console.error(err); res.status(500).json({ error: "Erro ao atualizar usuário" }); }
  });

  app.delete("/api/usuarios/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await db.delete(usuarios).where(eq(usuarios.id, id));
      res.json({ message: "Usuário deletado!" });
    } catch (err) { console.error(err); res.status(500).json({ error: "Erro ao deletar usuário" }); }
  });

  /* ── AULAS ── */
  app.get("/api/aulas", async (_req, res) => {
    res.json(await db.select().from(aulas));
  });

  app.post("/api/aulas", async (req, res) => {
    try {
      const { titulo, descricao, categoriaId, videoId } = req.body;
      await db.insert(aulas).values({ titulo, descricao, categoriaId, videoId });
      res.json({ message: "Aula criada!" });
    } catch (err) { console.error(err); res.status(500).json({ error: "Erro ao criar aula" }); }
  });

  app.delete("/api/aulas/:id", async (req, res) => {
    try {
      await db.delete(aulas).where(eq(aulas.id, Number(req.params.id)));
      res.json({ message: "Aula deletada!" });
    } catch (err) { console.error(err); res.status(500).json({ error: "Erro ao deletar aula" }); }
  });

  /* ── ANÚNCIOS (público) ── */
  app.get("/api/anuncios", async (_req, res) => {
    res.json(await db.select().from(anuncios));
  });

  /* ── ANÚNCIOS (prestador, sem prefixo /api) ── */
  app.get("/anuncios", async (_req, res) => {
    res.json(await db.select().from(anuncios));
  });

  app.post("/anuncios", async (req, res) => {
    try {
      const { titulo, descricao, preco, prestadorId } = req.body;
      await db.insert(anuncios).values({ titulo, descricao, preco, prestadorId });
      res.json({ message: "Anúncio criado!" });
    } catch (err) { console.error(err); res.status(500).json({ error: "Erro ao criar anúncio" }); }
  });

  app.put("/anuncios/:id", async (req, res) => {
    try {
      const { titulo, descricao, preco } = req.body;
      await db.update(anuncios).set({ titulo, descricao, preco }).where(eq(anuncios.id, Number(req.params.id)));
      res.json({ message: "Anúncio atualizado!" });
    } catch (err) { console.error(err); res.status(500).json({ error: "Erro ao atualizar anúncio" }); }
  });

  app.delete("/anuncios/:id", async (req, res) => {
    try {
      await db.delete(anuncios).where(eq(anuncios.id, Number(req.params.id)));
      res.json({ message: "Anúncio deletado!" });
    } catch (err) { console.error(err); res.status(500).json({ error: "Erro ao deletar anúncio" }); }
  });

  /* ── CATEGORIAS ── */
  app.get("/api/categorias", async (_req, res) => { res.json(await db.select().from(categorias)); });
  app.post("/api/categorias", async (req, res) => {
    try { await db.insert(categorias).values({ nome: req.body.nome }); res.json({ message: "Categoria criada!" }); }
    catch (err) { res.status(500).json({ error: "Erro ao criar categoria" }); }
  });
  app.delete("/api/categorias/:id", async (req, res) => {
    try { await db.delete(categorias).where(eq(categorias.id, Number(req.params.id))); res.json({ message: "Deletada!" }); }
    catch (err) { res.status(500).json({ error: "Erro ao deletar" }); }
  });

  /* ── COMENTÁRIOS ── */
  app.get("/api/comentarios", async (_req, res) => { res.json(await db.select().from(comentarios)); });
  app.post("/api/comentarios", async (req, res) => {
    try { const { texto, usuarioId, aulaId } = req.body; await db.insert(comentarios).values({ texto, usuarioId, aulaId }); res.json({ message: "Comentário criado!" }); }
    catch (err) { res.status(500).json({ error: "Erro ao criar comentário" }); }
  });
  app.delete("/api/comentarios/:id", async (req, res) => {
    try { await db.delete(comentarios).where(eq(comentarios.id, Number(req.params.id))); res.json({ message: "Deletado!" }); }
    catch (err) { res.status(500).json({ error: "Erro ao deletar" }); }
  });

  /* ── MATRÍCULAS ── */
  app.get("/api/matriculas", async (_req, res) => { res.json(await db.select().from(matriculas)); });
  app.post("/api/matriculas", async (req, res) => {
    try { const { usuarioId, aulaId } = req.body; await db.insert(matriculas).values({ usuarioId, aulaId }); res.json({ message: "Matrícula criada!" }); }
    catch (err) { res.status(500).json({ error: "Erro ao criar matrícula" }); }
  });
  app.delete("/api/matriculas/:id", async (req, res) => {
    try { await db.delete(matriculas).where(eq(matriculas.id, Number(req.params.id))); res.json({ message: "Deletada!" }); }
    catch (err) { res.status(500).json({ error: "Erro ao deletar" }); }
  });

  /* ── FAVORITOS ── */
  app.get("/api/prestadores", async (_req, res) => { res.json(await db.select().from(usuarios)); });
  app.post("/api/favoritos", async (req, res) => {
    try { const { consumidorId, prestadorId } = req.body; await db.insert(favoritos).values({ consumidorId, prestadorId }); res.json({ message: "Favoritado!" }); }
    catch (err) { res.status(500).json({ error: "Erro ao favoritar" }); }
  });
  app.get("/api/favoritos/:id", async (req, res) => {
    const consumidorId = Number(req.params.id);
    res.json(await db.select().from(favoritos).where(eq(favoritos.consumidorId, consumidorId)));
  });
  app.delete("/api/favoritos/:id", async (req, res) => {
    try { await db.delete(favoritos).where(eq(favoritos.id, Number(req.params.id))); res.json({ message: "Removido!" }); }
    catch (err) { res.status(500).json({ error: "Erro ao remover" }); }
  });

  /* ── AGENDA ── */
  app.get("/agenda", async (_req, res) => { res.json(await db.select().from(agenda)); });
  app.post("/agenda", async (req, res) => {
    try { const { prestadorId, data, horario, disponivel } = req.body; await db.insert(agenda).values({ prestadorId, data, horario, disponivel: disponivel ?? 1 }); res.json({ message: "Horário criado!" }); }
    catch (err) { res.status(500).json({ error: "Erro ao criar horário" }); }
  });
  app.put("/agenda/:id", async (req, res) => {
    try { const { data, horario, disponivel } = req.body; await db.update(agenda).set({ data, horario, disponivel }).where(eq(agenda.id, Number(req.params.id))); res.json({ message: "Atualizado!" }); }
    catch (err) { res.status(500).json({ error: "Erro ao atualizar" }); }
  });
  app.delete("/agenda/:id", async (req, res) => {
    try { await db.delete(agenda).where(eq(agenda.id, Number(req.params.id))); res.json({ message: "Deletado!" }); }
    catch (err) { res.status(500).json({ error: "Erro ao deletar" }); }
  });

  /* ── FRONTEND ── */
  const staticPath = process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => { res.sendFile(path.join(staticPath, "index.html")); });

  const port = process.env.PORT ?? 3333;
  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}/`);
    console.log(`📦 API disponível em http://localhost:${port}/api`);
  });
}

startServer().catch(console.error);
