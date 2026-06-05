import { Request, Response, NextFunction } from "express";
import { auth } from "../auth";

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Pega o token do cabeçalho enviado pelo Postman (Bearer Token)
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    let session = null;

    if (token) {
      // 2. Método definitivo para o Postman: Valida a sessão usando o Token direto
      session = await auth.api.getSessionFromToken({
        token: token
      });
    } else {
      // 3. Fallback para o navegador/front-end usando Cookies convencionais
      session = await auth.api.getSession({
        headers: req.headers
      });
    }

    if (!session) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    // 4. Injeta o usuário validado na requisição para a rota /perfil usar
    (req as any).user = session.user;
    next();
  } catch (error) {
    console.error("❌ Erro no middleware de autenticação:", error);
    return res.status(401).json({ error: "Não autenticado" });
  }
}