import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
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
} from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_CLIENT_ID = "387770715916-mdkhq8j4r9gjl3qttaa2kcfdlt39a9j3.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  app.use(session({
    secret: "edumarket-secret-key",
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3333/auth/google/callback",
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

  passport.deserializeUser(async (id: number, done) => {
    try {
      const lista = await db.select().from(usuarios).where(eq(usuarios.id, id));
      done(null, lista[0] ?? null);
    } catch (err) {
      done(err);
    }
  });

  /* =====================================================
     ROTAS GOOGLE OAUTH
  ===================================================== */
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
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
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3333;

  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}/`);
    console.log(`📦 API disponível em http://localhost:${port}/api`);
  });
}

startServer().catch(console.error);
