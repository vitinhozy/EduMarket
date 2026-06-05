import express from "express";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import Database from "better-sqlite3";

const sqlite = new Database("database.db");

export const db = drizzle(sqlite);
import {
  usuarios,
  categorias,
  aulas,
  comentarios,
  matriculas,
  agendas,
  contratacoes,
  pagamentos,
} from "./schema";

const app = express();

app.use(express.json());

/* =====================================================
   TESTE API
===================================================== */
app.get("/", (_req, res) => {
  res.json({
    message: "🚀 API funcionando!",
  });
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
    const { nome, email, senha } = req.body;

    await db.insert(usuarios).values({
      nome,
      email,
      senha,
    });

    res.json({
      message: "Usuário criado com sucesso!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao criar usuário",
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
   CONTRATAÇÕES
===================================================== */

/* CRIAR */
app.post("/contratacoes", async (req, res) => {
  try {
    const { consumidorId, prestadorId, anuncioId, agendaId, valor } = req.body;

    if (!consumidorId || !prestadorId || !anuncioId || !agendaId || !valor) {
      res.status(400).json({ error: "Campos obrigatórios faltando: consumidorId, prestadorId, anuncioId, agendaId, valor" });
      return;
    }

    // Verifica se o horário está disponível
    const agenda = await db
      .select()
      .from(agendas)
      .where(eq(agendas.id, agendaId));

    if (agenda.length === 0) {
      res.status(404).json({ error: "Agenda não encontrada" });
      return;
    }

    if (!agenda[0].disponivel) {
      res.status(409).json({ error: "Horário já reservado" });
      return;
    }

    // Cria a contratação
    const resultado = await db
      .insert(contratacoes)
      .values({ consumidorId, prestadorId, anuncioId, agendaId, valor, status: "pendente" })
      .returning();

    // Reserva o horário na agenda
    await db
      .update(agendas)
      .set({ disponivel: false })
      .where(eq(agendas.id, agendaId));

    res.status(201).json({
      message: "Contratação criada com sucesso!",
      contratacao: resultado[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar contratação" });
  }
});

/* LISTAR */
app.get("/contratacoes", async (_req, res) => {
  try {
    const lista = await db.select().from(contratacoes);
    res.json(lista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar contratações" });
  }
});

/* ATUALIZAR STATUS */
app.put("/contratacoes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const statusValidos = ["pendente", "confirmada", "cancelada", "concluida"];
    if (!status || !statusValidos.includes(status)) {
      res.status(400).json({ error: `Status inválido. Use: ${statusValidos.join(", ")}` });
      return;
    }

    const existente = await db
      .select()
      .from(contratacoes)
      .where(eq(contratacoes.id, id));

    if (existente.length === 0) {
      res.status(404).json({ error: "Contratação não encontrada" });
      return;
    }

    // Se cancelando, libera o horário na agenda
    if (status === "cancelada" && existente[0].agendaId) {
      await db
        .update(agendas)
        .set({ disponivel: true })
        .where(eq(agendas.id, existente[0].agendaId));
    }

    const atualizada = await db
      .update(contratacoes)
      .set({ status })
      .where(eq(contratacoes.id, id))
      .returning();

    res.json({
      message: "Status da contratação atualizado!",
      contratacao: atualizada[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar contratação" });
  }
});

/* =====================================================
   PAGAMENTOS
===================================================== */

/* REGISTRAR PAGAMENTO */
app.post("/pagamento", async (req, res) => {
  try {
    const { contratacaoId, metodo, valor } = req.body;

    if (!contratacaoId || !metodo || !valor) {
      res.status(400).json({ error: "Campos obrigatórios: contratacaoId, metodo, valor" });
      return;
    }

    const metodosValidos = ["pix", "cartao_credito", "cartao_debito", "boleto"];
    if (!metodosValidos.includes(metodo)) {
      res.status(400).json({ error: `Método inválido. Use: ${metodosValidos.join(", ")}` });
      return;
    }

    // Verifica se a contratação existe
    const contratacao = await db
      .select()
      .from(contratacoes)
      .where(eq(contratacoes.id, contratacaoId));

    if (contratacao.length === 0) {
      res.status(404).json({ error: "Contratação não encontrada" });
      return;
    }

    if (contratacao[0].status === "cancelada") {
      res.status(409).json({ error: "Não é possível pagar uma contratação cancelada" });
      return;
    }

    // Verifica se já existe pagamento aprovado
    const pagamentoExistente = await db
      .select()
      .from(pagamentos)
      .where(eq(pagamentos.contratacaoId, contratacaoId));

    const jaAprovado = pagamentoExistente.find((p) => p.status === "aprovado");
    if (jaAprovado) {
      res.status(409).json({ error: "Esta contratação já possui pagamento aprovado" });
      return;
    }

    // Registra o pagamento (simula aprovação automática)
    const criadoEm = new Date().toISOString();
    const pagamento = await db
      .insert(pagamentos)
      .values({ contratacaoId, metodo, valor, status: "aprovado", criadoEm })
      .returning();

    // Atualiza status da contratação para "confirmada"
    await db
      .update(contratacoes)
      .set({ status: "confirmada" })
      .where(eq(contratacoes.id, contratacaoId));

    res.status(201).json({
      message: "Pagamento registrado e contratação confirmada!",
      pagamento: pagamento[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao registrar pagamento" });
  }
});

/* =====================================================
   START SERVER
===================================================== */
app.listen(3333, () => {
  console.log("🚀 Server running on http://localhost:3333/");
});