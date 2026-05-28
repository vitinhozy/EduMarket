import { Router } from "express";
import { db } from "../db";
import { usuarios } from "../db/schema";

const router = Router();

// LISTAR TODOS
router.get("/", async (_, res) => {
  const data = await db.select().from(usuarios);

  res.json(data);
});

// CRIAR USUÁRIO
router.post("/", async (req, res) => {
  const { nome, email, senha } = req.body;

  await db.insert(usuarios).values({
    nome,
    email,
    senha,
  });

  res.json({
    message: "Usuário criado com sucesso!",
  });
});

export default router;