import express from "express";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";

import { db } from "./db";
import {
  usuarios,
  categorias,
  aulas,
  comentarios,
  matriculas,
} from "./db/schema";

const app = express();

app.use(express.json());
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },

  filename: (_req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_")
    );
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

/* =====================================================
   TESTE API
===================================================== */
app.get("/", (_req, res) => {
  res.json({
    message: "🚀 API funcionando!",
  });
});
/* =====================================================
   LOGIN
===================================================== */

app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email));

    if (usuario.length === 0) {
      return res.status(401).json({
        error: "Usuário não encontrado",
      });
    }

    if (usuario[0].senha !== senha) {
      return res.status(401).json({
        error: "Senha incorreta",
      });
    }

    res.json({
      message: "Login realizado com sucesso!",
      usuario: usuario[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao realizar login",
    });
  }
});

/* =====================================================
   USUÁRIOS
===================================================== */

/* LISTAR */
app.get("/usuarios", async (_req, res) => {
  const listaUsuarios = await db.select().from(usuarios);

  res.json(listaUsuarios);
});

/* BUSCAR POR ID */
app.get("/usuarios/:id", async (req, res) => {
  const id = Number(req.params.id);

  const usuario = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.id, id));

  res.json(usuario);
});

/* CRIAR */
app.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    await db.insert(usuarios).values({
      nome,
      email,
      senha,
      tipo,
    });

    res.json({
      message: "Usuário criado com sucesso!",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao criar usuário",
      details: error,
    });
  }
});

/* ATUALIZAR */

app.put("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { nome, email, senha } = req.body;

    await db
      .update(usuarios)
      .set({
        nome,
        email,
        senha,
      })
      .where(eq(usuarios.id, id));

    res.json({
      message: "Usuário atualizado com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao atualizar usuário",
    });
  }
});

/* DELETAR */
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await db.delete(usuarios).where(eq(usuarios.id, id));

    res.json({
      message: "Usuário deletado com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao deletar usuário",
    });
  }
});

/* =====================================================
   CATEGORIAS
===================================================== */

/* LISTAR */
app.get("/categorias", async (_req, res) => {
  const lista = await db.select().from(categorias);

  res.json(lista);
});

/* BUSCAR POR ID */
app.get("/categorias/:id", async (req, res) => {
  const id = Number(req.params.id);

  const categoria = await db
    .select()
    .from(categorias)
    .where(eq(categorias.id, id));

  res.json(categoria);
});

/* CRIAR */
app.post("/categorias", async (req, res) => {
  try {
    const { nome } = req.body;

    await db.insert(categorias).values({
      nome,
    });

    res.json({
      message: "Categoria criada com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao criar categoria",
    });
  }
});

/* ATUALIZAR */
app.put("/categorias/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { nome } = req.body;

    await db
      .update(categorias)
      .set({
        nome,
      })
      .where(eq(categorias.id, id));

    res.json({
      message: "Categoria atualizada com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao atualizar categoria",
    });
  }
});

/* DELETAR */
app.delete("/categorias/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await db.delete(categorias).where(eq(categorias.id, id));

    res.json({
      message: "Categoria deletada com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao deletar categoria",
    });
  }
});

/* =====================================================
   AULAS
===================================================== */

/* LISTAR */
app.get("/aulas", async (_req, res) => {
  const lista = await db.select().from(aulas);

  res.json(lista);
});

/* BUSCAR POR ID */
app.get("/aulas/:id", async (req, res) => {
  const id = Number(req.params.id);

  const aula = await db
    .select()
    .from(aulas)
    .where(eq(aulas.id, id));

  res.json(aula);
});

/* CRIAR */
app.post("/aulas", async (req, res) => {
  try {
    const { titulo, descricao, categoriaId } = req.body;

    await db.insert(aulas).values({
      titulo,
      descricao,
      categoriaId,
    });

    res.json({
      message: "Aula criada com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao criar aula",
    });
  }
});

/* ATUALIZAR */
app.put("/aulas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { titulo, descricao, categoriaId } = req.body;

    await db
      .update(aulas)
      .set({
        titulo,
        descricao,
        categoriaId,
      })
      .where(eq(aulas.id, id));

    res.json({
      message: "Aula atualizada com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao atualizar aula",
    });
  }
});

/* DELETAR */
app.delete("/aulas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await db.delete(aulas).where(eq(aulas.id, id));

    res.json({
      message: "Aula deletada com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao deletar aula",
    });
  }
});

/* =====================================================
   COMENTÁRIOS
===================================================== */

/* LISTAR */
app.get("/comentarios", async (_req, res) => {
  const lista = await db.select().from(comentarios);

  res.json(lista);
});

/* BUSCAR POR ID */
app.get("/comentarios/:id", async (req, res) => {
  const id = Number(req.params.id);

  const comentario = await db
    .select()
    .from(comentarios)
    .where(eq(comentarios.id, id));

  res.json(comentario);
});

/* CRIAR */
app.post("/comentarios", async (req, res) => {
  try {
    const { texto, usuarioId, aulaId } = req.body;

    await db.insert(comentarios).values({
      texto,
      usuarioId,
      aulaId,
    });

    res.json({
      message: "Comentário criado com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao criar comentário",
    });
  }
});

/* ATUALIZAR */
app.put("/comentarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { texto, usuarioId, aulaId } = req.body;

    await db
      .update(comentarios)
      .set({
        texto,
        usuarioId,
        aulaId,
      })
      .where(eq(comentarios.id, id));

    res.json({
      message: "Comentário atualizado com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao atualizar comentário",
    });
  }
});

/* DELETAR */
app.delete("/comentarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await db.delete(comentarios).where(eq(comentarios.id, id));

    res.json({
      message: "Comentário deletado com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao deletar comentário",
    });
  }
});

/* =====================================================
   MATRÍCULAS
===================================================== */

/* LISTAR */
app.get("/matriculas", async (_req, res) => {
  const lista = await db.select().from(matriculas);

  res.json(lista);
});

/* BUSCAR POR ID */
app.get("/matriculas/:id", async (req, res) => {
  const id = Number(req.params.id);

  const matricula = await db
    .select()
    .from(matriculas)
    .where(eq(matriculas.id, id));

  res.json(matricula);
});

/* CRIAR */
app.post("/matriculas", async (req, res) => {
  try {
    const { usuarioId, aulaId } = req.body;

    await db.insert(matriculas).values({
      usuarioId,
      aulaId,
    });

    res.json({
      message: "Matrícula criada com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao criar matrícula",
    });
  }
});

/* ATUALIZAR */
app.put("/matriculas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { usuarioId, aulaId } = req.body;

    await db
      .update(matriculas)
      .set({
        usuarioId,
        aulaId,
      })
      .where(eq(matriculas.id, id));

    res.json({
      message: "Matrícula atualizada com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao atualizar matrícula",
    });
  }
});

/* DELETAR */
app.delete("/matriculas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await db.delete(matriculas).where(eq(matriculas.id, id));

    res.json({
      message: "Matrícula deletada com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao deletar matrícula",
    });
  }
});

/* =====================================================
   UPLOAD FOTO PERFIL
===================================================== */

app.post(
  "/upload/:id",
  upload.single("foto"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!req.file) {
        return res.status(400).json({
          error: "Nenhum arquivo enviado",
        });
      }

      const caminhoFoto = `/uploads/${req.file.filename}`;

      await db
        .update(usuarios)
        .set({
          foto: caminhoFoto,
        })
        .where(eq(usuarios.id, id));

      res.json({
        message: "Foto enviada com sucesso!",
        foto: caminhoFoto,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error: "Erro ao enviar foto",
      });
    }
  }
);

/* =====================================================
   START SERVER
===================================================== */
app.listen(3333, () => {
  console.log("🚀 Server running on http://localhost:3333/");
});