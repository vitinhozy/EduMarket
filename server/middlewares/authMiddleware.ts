import { fromNodeHeaders } from "better-auth/node"; // <-- Importação crucial
import { auth } from "../auth";

export async function getUser(req: any, res: any, next: any) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    
    req.user = session.user;
    next();
  } catch (err) {
    console.error("Erro no Auth Middleware:", err);
    return res.status(401).json({ error: "Sessão inválida" });
  }
}