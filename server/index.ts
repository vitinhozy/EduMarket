import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
<<<<<<< HEAD
import { eq } from "drizzle-orm";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { db } from "./db/index.js";
import {
  usuarios,
  categorias,
  aulas,
  comentarios,
  matriculas,
  favoritos,
  anuncios,
  agenda,
=======
import { eq, and } from "drizzle-orm";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import helmet from "helmet";
import cors from "cors";
import bcrypt from "bcrypt";
import Stripe from "stripe";
import { Resend } from "resend";

import { db } from "./db/index.js";
import {
  usuarios, categorias, aulas, comentarios,
  matriculas, favoritos, anuncios, agenda,
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
} from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID     ?? "387770715916-mdkhq8j4r9gjl3qttaa2kcfdlt39a9j3.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "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";
const SESSION_SECRET       = process.env.SESSION_SECRET       ?? "edumarket-secret-key";
const SALT_ROUNDS          = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY ?? "pk_test_51TfH7v5AWcMnv5shAkXfp2Mi5ldpoKS94kZGHVuYBK6oU2W8lODEg5E9ocfAA21qt4cCwyFTB3t2WnoySSETbYC700RXQJZQLc";

const stripe = new Stripe(STRIPE_SECRET_KEY);

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "re_MmMGV1Ja_JzBEukYK6wbJzwyaCvvkkc1E";
const resend = new Resend(RESEND_API_KEY);

// Mapa temporário de códigos de verificação: email → { code, expiry }
const verificationCodes = new Map<string, { code: string; expiry: number }>();

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* ─── helpers ─────────────────────────────────────────── */

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);
}

/* ─── server ──────────────────────────────────────────── */

const GOOGLE_CLIENT_ID = "387770715916-mdkhq8j4r9gjl3qttaa2kcfdlt39a9j3.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

async function startServer() {
  const app    = express();
  const server = createServer(app);

<<<<<<< HEAD
  app.use(express.json());

  app.use(session({
    secret: "edumarket-secret-key",
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

=======
  /* middlewares globais */
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(express.json());
  app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 86_400_000 },
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  /* ── Google OAuth ─────────────────────────────────── */
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3333/auth/google/callback",
<<<<<<< HEAD
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value ?? "";
      const nome = profile.displayName ?? "";

      const lista = await db.select().from(usuarios).where(eq(usuarios.email, email));

      if (lista.length > 0) {
        return done(null, lista[0]);
      }

      await db.insert(usuarios).values({ nome, email, senha: "google-oauth" });
      const novo = await db.select().from(usuarios).where(eq(usuarios.email, email));
      return done(null, novo[0]);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => done(null, user.id));

=======
  }, async (_at, _rt, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value ?? "";
      const nome  = profile.displayName ?? "";
      if (!email) return done(new Error("Email não encontrado no perfil Google"));

      const existe = await db.select().from(usuarios).where(eq(usuarios.email, email));
      if (existe.length > 0) return done(null, existe[0]);

      const hash = await bcrypt.hash(`google_${Date.now()}`, SALT_ROUNDS);
      await db.insert(usuarios).values({ nome, email, senha: hash });
      const novo = await db.select().from(usuarios).where(eq(usuarios.email, email));
      return done(null, novo[0]);
    } catch (err) { return done(err); }
  }));

  passport.serializeUser((user: any, done) => done(null, user.id));
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  passport.deserializeUser(async (id: number, done) => {
    try {
      const lista = await db.select().from(usuarios).where(eq(usuarios.id, id));
      done(null, lista[0] ?? null);
<<<<<<< HEAD
    } catch (err) {
      done(err);
    }
  });

  /* =====================================================
     ROTAS GOOGLE OAUTH
  ===================================================== */
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
=======
    } catch (err) { done(err); }
  });

  app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328

  app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
<<<<<<< HEAD
      const user = req.user as any;
      res.redirect(`http://localhost:3000/auth/success?id=${user.id}&nome=${encodeURIComponent(user.nome)}&email=${encodeURIComponent(user.email)}`);
    }
  );

  /* =====================================================
     TESTE API
  ===================================================== */
  app.get("/api", (_req, res) => {
    res.json({ message: "🚀 API funcionando!" });
  });

  /* =====================================================
     USUÁRIOS
  ===================================================== */
  app.get("/api/usuarios", async (_req, res) => {
    const lista = await db.select().from(usuarios);
    res.json(lista);
  });

  app.get("/api/usuarios/:id", async (req, res) => {
    const id = Number(req.params.id);
    const usuario = await db.select().from(usuarios).where(eq(usuarios.id, id));
    res.json(usuario);
  });

  app.post("/api/usuarios", async (req, res) => {
    try {
      const { nome, email, senha } = req.body;
      await db.insert(usuarios).values({ nome, email, senha });
      res.json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  });

  app.put("/api/usuarios/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { nome, email, senha } = req.body;
      await db.update(usuarios).set({ nome, email, senha }).where(eq(usuarios.id, id));
      res.json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  });

  app.delete("/api/usuarios/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await db.delete(usuarios).where(eq(usuarios.id, id));
      res.json({ message: "Usuário deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao deletar usuário" });
    }
  });

  /* =====================================================
     CATEGORIAS
  ===================================================== */
  app.get("/api/categorias", async (_req, res) => {
    const lista = await db.select().from(categorias);
    res.json(lista);
  });

  app.post("/api/categorias", async (req, res) => {
    try {
      const { nome } = req.body;
      await db.insert(categorias).values({ nome });
      res.json({ message: "Categoria criada com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao criar categoria" });
    }
  });

  app.delete("/api/categorias/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await db.delete(categorias).where(eq(categorias.id, id));
      res.json({ message: "Categoria deletada com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao deletar categoria" });
    }
  });

  /* =====================================================
     AULAS
  ===================================================== */
  app.get("/api/aulas", async (_req, res) => {
    const lista = await db.select().from(aulas);
    res.json(lista);
  });

  app.post("/api/aulas", async (req, res) => {
    try {
      const { titulo, descricao, categoriaId } = req.body;
      await db.insert(aulas).values({ titulo, descricao, categoriaId });
      res.json({ message: "Aula criada com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao criar aula" });
    }
  });

  app.delete("/api/aulas/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await db.delete(aulas).where(eq(aulas.id, id));
      res.json({ message: "Aula deletada com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao deletar aula" });
    }
  });

  /* =====================================================
     COMENTÁRIOS
  ===================================================== */
  app.get("/api/comentarios", async (_req, res) => {
    const lista = await db.select().from(comentarios);
    res.json(lista);
  });

  app.post("/api/comentarios", async (req, res) => {
    try {
      const { texto, usuarioId, aulaId } = req.body;
      await db.insert(comentarios).values({ texto, usuarioId, aulaId });
      res.json({ message: "Comentário criado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao criar comentário" });
    }
  });

  app.delete("/api/comentarios/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await db.delete(comentarios).where(eq(comentarios.id, id));
      res.json({ message: "Comentário deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao deletar comentário" });
    }
  });

  /* =====================================================
     MATRÍCULAS
  ===================================================== */
  app.get("/api/matriculas", async (_req, res) => {
    const lista = await db.select().from(matriculas);
    res.json(lista);
  });

  app.post("/api/matriculas", async (req, res) => {
    try {
      const { usuarioId, aulaId } = req.body;
      await db.insert(matriculas).values({ usuarioId, aulaId });
      res.json({ message: "Matrícula criada com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao criar matrícula" });
    }
  });

  app.delete("/api/matriculas/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await db.delete(matriculas).where(eq(matriculas.id, id));
      res.json({ message: "Matrícula deletada com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao deletar matrícula" });
    }
  });

  /* =====================================================
     PESSOA 3 — CONSUMIDOR E FAVORITOS
  ===================================================== */
  app.get("/api/prestadores", async (_req, res) => {
    const lista = await db.select().from(usuarios);
    res.json(lista);
  });

  app.get("/api/anuncios", async (_req, res) => {
    const lista = await db.select().from(aulas);
    res.json(lista);
  });

  app.post("/api/favoritos", async (req, res) => {
    try {
      const { consumidorId, prestadorId } = req.body;
      await db.insert(favoritos).values({ consumidorId, prestadorId });
      res.json({ message: "Prestador favoritado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao favoritar prestador" });
    }
  });

  app.get("/api/favoritos/:id", async (req, res) => {
    const consumidorId = Number(req.params.id);
    const lista = await db.select().from(favoritos).where(eq(favoritos.consumidorId, consumidorId));
    res.json(lista);
  });

  app.delete("/api/favoritos/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await db.delete(favoritos).where(eq(favoritos.id, id));
      res.json({ message: "Favorito removido com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao remover favorito" });
    }
  });


  /* =====================================================
     PESSOA 2 — PRESTADOR DE SERVIÇOS
  ===================================================== */

  /* ------ ANÚNCIOS ------ */

  app.get("/anuncios", async (_req, res) => {
    const lista = await db.select().from(anuncios);
    res.json(lista);
  });

  app.post("/anuncios", async (req, res) => {
    try {
      const { titulo, descricao, preco, prestadorId } = req.body;
      await db.insert(anuncios).values({ titulo, descricao, preco, prestadorId });
      res.json({ message: "Anúncio criado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao criar anúncio" });
    }
  });

  app.put("/anuncios/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { titulo, descricao, preco } = req.body;
      await db.update(anuncios).set({ titulo, descricao, preco }).where(eq(anuncios.id, id));
      res.json({ message: "Anúncio atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao atualizar anúncio" });
    }
  });

  app.delete("/anuncios/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await db.delete(anuncios).where(eq(anuncios.id, id));
      res.json({ message: "Anúncio deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao deletar anúncio" });
    }
  });

  /* ------ AGENDA ------ */

  app.get("/agenda", async (_req, res) => {
    const lista = await db.select().from(agenda);
    res.json(lista);
  });

  app.post("/agenda", async (req, res) => {
    try {
      const { prestadorId, data, horario, disponivel } = req.body;
      await db.insert(agenda).values({ prestadorId, data, horario, disponivel: disponivel ?? 1 });
      res.json({ message: "Horário criado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao criar horário" });
    }
  });

  app.put("/agenda/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { data, horario, disponivel } = req.body;
      await db.update(agenda).set({ data, horario, disponivel }).where(eq(agenda.id, id));
      res.json({ message: "Horário atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao atualizar horário" });
    }
  });

  app.delete("/agenda/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await db.delete(agenda).where(eq(agenda.id, id));
      res.json({ message: "Horário deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao deletar horário" });
    }
  });

  /* =====================================================
     SERVE FRONTEND
  ===================================================== */
=======
      const u = req.user as any;
      res.redirect(
        `http://localhost:3000/auth/success` +
        `?id=${u.id}&nome=${encodeURIComponent(u.nome)}&email=${encodeURIComponent(u.email)}`
      );
    }
  );

  /* ── health check ─────────────────────────────────── */
  app.get("/api", (_req, res) => res.json({ ok: true }));

  /* ── auth ─────────────────────────────────────────── */

  /* ── Verificação de Email ─────────────────────────── */

  // Envia código de verificação para o email
  app.post("/api/auth/send-verification", asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email?.trim() || !EMAIL_RE.test(email)) {
      res.status(400).json({ error: "Email inválido" }); return;
    }

    // Verificar se email já está cadastrado
    const existe = await db.select({ id: usuarios.id })
      .from(usuarios).where(eq(usuarios.email, email.toLowerCase().trim()));
    if (existe.length > 0) {
      res.status(409).json({ error: "Email já cadastrado" }); return;
    }

    const code = generateCode();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutos

    verificationCodes.set(email.toLowerCase(), { code, expiry });

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "EduMarket — Código de verificação",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #7c3aed; font-size: 28px; margin: 0;">EduMarket</h1>
            <p style="color: #6b7280; margin: 8px 0 0;">Verificação de email</p>
          </div>
          <div style="background: white; border-radius: 8px; padding: 24px; text-align: center;">
            <p style="color: #374151; margin: 0 0 16px;">Seu código de verificação é:</p>
            <div style="background: linear-gradient(135deg, #7c3aed, #2563eb); border-radius: 8px; padding: 16px; display: inline-block;">
              <span style="color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px;">${code}</span>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin: 16px 0 0;">Este código expira em <strong>10 minutos</strong>.</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 16px 0 0;">
            Se você não solicitou este código, ignore este email.
          </p>
        </div>
      `,
    });

    res.json({ message: "Código enviado com sucesso!" });
  }));

  // Verifica o código inserido
  app.post("/api/auth/verify-code", asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ error: "Email e código são obrigatórios" }); return;
    }

    const stored = verificationCodes.get(email.toLowerCase());

    if (!stored) {
      res.status(400).json({ error: "Código não encontrado. Solicite um novo." }); return;
    }

    if (Date.now() > stored.expiry) {
      verificationCodes.delete(email.toLowerCase());
      res.status(400).json({ error: "Código expirado. Solicite um novo." }); return;
    }

    if (stored.code !== code) {
      res.status(400).json({ error: "Código incorreto" }); return;
    }

    verificationCodes.delete(email.toLowerCase());
    res.json({ message: "Email verificado com sucesso!", verified: true });
  }));

  app.post("/api/auth/register", asyncHandler(async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome?.trim() || !email?.trim() || !senha) {
      res.status(400).json({ error: "nome, email e senha são obrigatórios" }); return;
    }
    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: "Formato de email inválido" }); return;
    }
    if (senha.length < 6) {
      res.status(400).json({ error: "Senha deve ter ao menos 6 caracteres" }); return;
    }

    const existe = await db.select({ id: usuarios.id })
      .from(usuarios).where(eq(usuarios.email, email.toLowerCase()));
    if (existe.length > 0) {
      res.status(409).json({ error: "Email já cadastrado" }); return;
    }

    const hash = await bcrypt.hash(senha, SALT_ROUNDS);
    await db.insert(usuarios).values({ nome: nome.trim(), email: email.toLowerCase(), senha: hash });

    const novo = await db.select({ id: usuarios.id, nome: usuarios.nome, email: usuarios.email })
      .from(usuarios).where(eq(usuarios.email, email.toLowerCase()));
    res.status(201).json({ message: "Usuário criado com sucesso!", usuario: novo[0] });
  }));

  app.post("/api/auth/login", asyncHandler(async (req, res) => {
    const { email, senha } = req.body;

    if (!email?.trim() || !senha) {
      res.status(400).json({ error: "email e senha são obrigatórios" }); return;
    }

    const lista = await db.select().from(usuarios)
      .where(eq(usuarios.email, email.toLowerCase().trim()));

    if (!lista.length) {
      res.status(401).json({ error: "Email ou senha incorretos" }); return;
    }

    // Conta criada via Google — senha interna não é usável
    if (lista[0].senha.startsWith("google_")) {
      res.status(401).json({ error: "Esta conta usa login pelo Google" }); return;
    }

    const valido = await bcrypt.compare(senha, lista[0].senha);
    if (!valido) {
      res.status(401).json({ error: "Email ou senha incorretos" }); return;
    }

    const { senha: _, ...usuario } = lista[0];
    res.json({ message: "Login realizado com sucesso!", usuario });
  }));

  /* ── usuários ─────────────────────────────────────── */
  app.get("/api/usuarios", asyncHandler(async (_req, res) => {
    res.json(await db.select({ id: usuarios.id, nome: usuarios.nome, email: usuarios.email }).from(usuarios));
  }));

  app.get("/api/usuarios/:id", asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: "ID inválido" }); return; }

    const lista = await db.select({ id: usuarios.id, nome: usuarios.nome, email: usuarios.email })
      .from(usuarios).where(eq(usuarios.id, id));
    if (!lista.length) { res.status(404).json({ error: "Usuário não encontrado" }); return; }
    res.json(lista[0]);
  }));

  app.put("/api/usuarios/:id", asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: "ID inválido" }); return; }

    const { nome, email } = req.body;
    if (!nome?.trim() && !email?.trim()) {
      res.status(400).json({ error: "Informe nome ou email para atualizar" }); return;
    }
    if (email && !EMAIL_RE.test(email)) {
      res.status(400).json({ error: "Formato de email inválido" }); return;
    }

    await db.update(usuarios).set({
      ...(nome?.trim()          && { nome: nome.trim() }),
      ...(email?.trim()         && { email: email.toLowerCase().trim() }),
    }).where(eq(usuarios.id, id));
    res.json({ message: "Usuário atualizado com sucesso!" });
  }));

  app.delete("/api/usuarios/:id", asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: "ID inválido" }); return; }

    const existe = await db.select({ id: usuarios.id }).from(usuarios).where(eq(usuarios.id, id));
    if (!existe.length) { res.status(404).json({ error: "Usuário não encontrado" }); return; }

    await db.delete(usuarios).where(eq(usuarios.id, id));
    res.json({ message: "Usuário deletado com sucesso!" });
  }));

  /* ── categorias ───────────────────────────────────── */
  app.get("/api/categorias", asyncHandler(async (_req, res) => {
    res.json(await db.select().from(categorias));
  }));

  app.post("/api/categorias", asyncHandler(async (req, res) => {
    const { nome } = req.body;
    if (!nome?.trim()) { res.status(400).json({ error: "nome é obrigatório" }); return; }

    await db.insert(categorias).values({ nome: nome.trim() });
    res.status(201).json({ message: "Categoria criada com sucesso!" });
  }));

  app.delete("/api/categorias/:id", asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: "ID inválido" }); return; }

    const existe = await db.select({ id: categorias.id }).from(categorias).where(eq(categorias.id, id));
    if (!existe.length) { res.status(404).json({ error: "Categoria não encontrada" }); return; }

    await db.delete(categorias).where(eq(categorias.id, id));
    res.json({ message: "Categoria deletada com sucesso!" });
  }));

  /* ── aulas ────────────────────────────────────────── */
  app.get("/api/aulas", asyncHandler(async (_req, res) => {
    res.json(await db.select().from(aulas));
  }));

  app.post("/api/aulas", asyncHandler(async (req, res) => {
    const { titulo, descricao, categoriaId } = req.body;
    if (!titulo?.trim() || !descricao?.trim() || !categoriaId) {
      res.status(400).json({ error: "titulo, descricao e categoriaId são obrigatórios" }); return;
    }
    await db.insert(aulas).values({ titulo: titulo.trim(), descricao: descricao.trim(), categoriaId });
    res.status(201).json({ message: "Aula criada com sucesso!" });
  }));

  app.delete("/api/aulas/:id", asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: "ID inválido" }); return; }

    const existe = await db.select({ id: aulas.id }).from(aulas).where(eq(aulas.id, id));
    if (!existe.length) { res.status(404).json({ error: "Aula não encontrada" }); return; }

    await db.delete(aulas).where(eq(aulas.id, id));
    res.json({ message: "Aula deletada com sucesso!" });
  }));

  /* ── comentários ──────────────────────────────────── */
  app.get("/api/comentarios", asyncHandler(async (_req, res) => {
    res.json(await db.select().from(comentarios));
  }));

  app.post("/api/comentarios", asyncHandler(async (req, res) => {
    const { texto, usuarioId, aulaId } = req.body;
    if (!texto?.trim() || !usuarioId || !aulaId) {
      res.status(400).json({ error: "texto, usuarioId e aulaId são obrigatórios" }); return;
    }
    await db.insert(comentarios).values({ texto: texto.trim(), usuarioId, aulaId });
    res.status(201).json({ message: "Comentário criado com sucesso!" });
  }));

  app.delete("/api/comentarios/:id", asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: "ID inválido" }); return; }

    const existe = await db.select({ id: comentarios.id }).from(comentarios).where(eq(comentarios.id, id));
    if (!existe.length) { res.status(404).json({ error: "Comentário não encontrado" }); return; }

    await db.delete(comentarios).where(eq(comentarios.id, id));
    res.json({ message: "Comentário deletado com sucesso!" });
  }));

  /* ── matrículas ───────────────────────────────────── */
  app.get("/api/matriculas", asyncHandler(async (_req, res) => {
    res.json(await db.select().from(matriculas));
  }));

  app.post("/api/matriculas", asyncHandler(async (req, res) => {
    const { usuarioId, aulaId } = req.body;
    if (!usuarioId || !aulaId) {
      res.status(400).json({ error: "usuarioId e aulaId são obrigatórios" }); return;
    }
    await db.insert(matriculas).values({ usuarioId, aulaId });
    res.status(201).json({ message: "Matrícula criada com sucesso!" });
  }));

  app.delete("/api/matriculas/:id", asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: "ID inválido" }); return; }

    const existe = await db.select({ id: matriculas.id }).from(matriculas).where(eq(matriculas.id, id));
    if (!existe.length) { res.status(404).json({ error: "Matrícula não encontrada" }); return; }

    await db.delete(matriculas).where(eq(matriculas.id, id));
    res.json({ message: "Matrícula deletada com sucesso!" });
  }));

  /* ── Pessoa 3: prestadores / anúncios / favoritos ─── */
  app.get("/api/prestadores", asyncHandler(async (_req, res) => {
    res.json(await db.select({ id: usuarios.id, nome: usuarios.nome, email: usuarios.email }).from(usuarios));
  }));

  app.get("/api/anuncios", asyncHandler(async (_req, res) => {
    res.json(await db.select().from(anuncios));
  }));

  app.post("/api/favoritos", asyncHandler(async (req, res) => {
    const { consumidorId, prestadorId } = req.body;
    if (!consumidorId || !prestadorId) {
      res.status(400).json({ error: "consumidorId e prestadorId são obrigatórios" }); return;
    }

    const jaExiste = await db.select({ id: favoritos.id }).from(favoritos)
      .where(and(eq(favoritos.consumidorId, consumidorId), eq(favoritos.prestadorId, prestadorId)));
    if (jaExiste.length > 0) {
      res.status(409).json({ error: "Prestador já favoritado" }); return;
    }

    await db.insert(favoritos).values({ consumidorId, prestadorId });
    res.status(201).json({ message: "Prestador favoritado com sucesso!" });
  }));

  app.get("/api/favoritos/:id", asyncHandler(async (req, res) => {
    const consumidorId = parseId(req.params.id);
    if (!consumidorId) { res.status(400).json({ error: "ID inválido" }); return; }

    res.json(await db.select().from(favoritos).where(eq(favoritos.consumidorId, consumidorId)));
  }));

  app.delete("/api/favoritos/:id", asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: "ID inválido" }); return; }

    const existe = await db.select({ id: favoritos.id }).from(favoritos).where(eq(favoritos.id, id));
    if (!existe.length) { res.status(404).json({ error: "Favorito não encontrado" }); return; }

    await db.delete(favoritos).where(eq(favoritos.id, id));
    res.json({ message: "Favorito removido com sucesso!" });
  }));

  /* ── Pessoa 2: anúncios do prestador ─────────────── */
  app.get("/api/meus-anuncios", asyncHandler(async (_req, res) => {
    res.json(await db.select().from(anuncios));
  }));

  app.post("/api/meus-anuncios", asyncHandler(async (req, res) => {
    const { titulo, descricao, preco, prestadorId } = req.body;
    if (!titulo?.trim() || !descricao?.trim() || preco === undefined || !prestadorId) {
      res.status(400).json({ error: "titulo, descricao, preco e prestadorId são obrigatórios" }); return;
    }
    if (isNaN(Number(preco)) || Number(preco) < 0) {
      res.status(400).json({ error: "preco deve ser um número positivo" }); return;
    }

    await db.insert(anuncios).values({
      titulo: titulo.trim(), descricao: descricao.trim(),
      preco: Number(preco), prestadorId,
    });
    res.status(201).json({ message: "Anúncio criado com sucesso!" });
  }));

  app.put("/api/meus-anuncios/:id", asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: "ID inválido" }); return; }

    const existe = await db.select({ id: anuncios.id }).from(anuncios).where(eq(anuncios.id, id));
    if (!existe.length) { res.status(404).json({ error: "Anúncio não encontrado" }); return; }

    const { titulo, descricao, preco } = req.body;
    if (!titulo && !descricao && preco === undefined) {
      res.status(400).json({ error: "Informe ao menos um campo para atualizar" }); return;
    }
    if (preco !== undefined && (isNaN(Number(preco)) || Number(preco) < 0)) {
      res.status(400).json({ error: "preco deve ser um número positivo" }); return;
    }

    await db.update(anuncios).set({
      ...(titulo?.trim()          && { titulo: titulo.trim() }),
      ...(descricao?.trim()       && { descricao: descricao.trim() }),
      ...(preco !== undefined      && { preco: Number(preco) }),
    }).where(eq(anuncios.id, id));
    res.json({ message: "Anúncio atualizado com sucesso!" });
  }));

  app.delete("/api/meus-anuncios/:id", asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: "ID inválido" }); return; }

    const existe = await db.select({ id: anuncios.id }).from(anuncios).where(eq(anuncios.id, id));
    if (!existe.length) { res.status(404).json({ error: "Anúncio não encontrado" }); return; }

    await db.delete(anuncios).where(eq(anuncios.id, id));
    res.json({ message: "Anúncio deletado com sucesso!" });
  }));

  /* ── Pessoa 2: agenda ─────────────────────────────── */
  const DATA_RE    = /^\d{4}-\d{2}-\d{2}$/;
  const HORARIO_RE = /^\d{2}:\d{2}$/;

  app.get("/api/agenda", asyncHandler(async (_req, res) => {
    res.json(await db.select().from(agenda));
  }));

  app.post("/api/agenda", asyncHandler(async (req, res) => {
    const { prestadorId, data, horario, disponivel } = req.body;
    if (!prestadorId || !data || !horario) {
      res.status(400).json({ error: "prestadorId, data e horario são obrigatórios" }); return;
    }
    if (!DATA_RE.test(data)) {
      res.status(400).json({ error: "data deve estar no formato YYYY-MM-DD" }); return;
    }
    if (!HORARIO_RE.test(horario)) {
      res.status(400).json({ error: "horario deve estar no formato HH:MM" }); return;
    }

    const conflito = await db.select({ id: agenda.id }).from(agenda)
      .where(and(eq(agenda.prestadorId, prestadorId), eq(agenda.data, data), eq(agenda.horario, horario)));
    if (conflito.length > 0) {
      res.status(409).json({ error: "Prestador já tem um horário nesse dia e hora" }); return;
    }

    await db.insert(agenda).values({ prestadorId, data, horario, disponivel: disponivel ?? 1 });
    res.status(201).json({ message: "Horário criado com sucesso!" });
  }));

  app.put("/api/agenda/:id", asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: "ID inválido" }); return; }

    const existe = await db.select().from(agenda).where(eq(agenda.id, id));
    if (!existe.length) { res.status(404).json({ error: "Horário não encontrado" }); return; }

    const { data, horario, disponivel } = req.body;
    if (!data && !horario && disponivel === undefined) {
      res.status(400).json({ error: "Informe ao menos um campo para atualizar" }); return;
    }
    if (data && !DATA_RE.test(data)) {
      res.status(400).json({ error: "data deve estar no formato YYYY-MM-DD" }); return;
    }
    if (horario && !HORARIO_RE.test(horario)) {
      res.status(400).json({ error: "horario deve estar no formato HH:MM" }); return;
    }

    const novaData    = data    ?? existe[0].data;
    const novoHorario = horario ?? existe[0].horario;
    const conflito    = await db.select({ id: agenda.id }).from(agenda)
      .where(and(
        eq(agenda.prestadorId, existe[0].prestadorId),
        eq(agenda.data,        novaData),
        eq(agenda.horario,     novoHorario),
      ));
    if (conflito.length > 0 && conflito[0].id !== id) {
      res.status(409).json({ error: "Prestador já tem um horário nesse dia e hora" }); return;
    }

    await db.update(agenda).set({
      ...(data                  && { data }),
      ...(horario               && { horario }),
      ...(disponivel !== undefined && { disponivel }),
    }).where(eq(agenda.id, id));
    res.json({ message: "Horário atualizado com sucesso!" });
  }));

  app.delete("/api/agenda/:id", asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: "ID inválido" }); return; }

    const existe = await db.select({ id: agenda.id }).from(agenda).where(eq(agenda.id, id));
    if (!existe.length) { res.status(404).json({ error: "Horário não encontrado" }); return; }

    await db.delete(agenda).where(eq(agenda.id, id));
    res.json({ message: "Horário deletado com sucesso!" });
  }));


  /* ── Stripe Pagamento ────────────────────────────── */

  app.get("/api/stripe/config", (_req, res) => {
    res.json({ publishableKey: STRIPE_PUBLISHABLE_KEY });
  });

  app.post("/api/stripe/create-payment-intent", asyncHandler(async (req, res) => {
    const { amount, currency = "brl", description } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      res.status(400).json({ error: "Valor inválido" }); return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), // Stripe usa centavos
      currency,
      description: description ?? "Compra EduMarket",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  }));

  /* ── static + SPA fallback ────────────────────────── */
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

<<<<<<< HEAD
  const port = process.env.PORT || 3333;

  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}/`);
    console.log(`📦 API disponível em http://localhost:${port}/api`);
=======
  /* ── error handler global — deve ser o ÚLTIMO middleware ── */
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[ERROR]", err.message);
    res.status(500).json({ error: "Erro interno do servidor" });
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  });

  const port = process.env.PORT ?? 3333;
  server.listen(port, () => console.log(`Server → http://localhost:${port}`));
}

startServer().catch(console.error);
