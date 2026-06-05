import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema"; // Importa as tabelas do seu banco

export const auth = betterAuth({
  // 1. Configurações de rotas e origens aceitas
  baseURL: "http://localhost:3333/auth",
  trustedOrigins: ["http://localhost:3333", "http://localhost:3000"],

  // 2. Vincula o Better Auth ao seu banco SQLite através do Drizzle ORM
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  // 3. Configurações do método de Autenticação (Requisito: Cadastro e Login)
  emailAndPassword: {
    enabled: true,

    // GATILHO CRUCIAL PARA A SUA ENTREGA:
    // Assim que o usuário se cadastrar no Better Auth, este bloco roda e joga 
    // os dados dele para a tabela complementar 'usuarios' exigida no seu trabalho!
    async onSignUp(ctx: any) {
      const u = ctx.user;
      try {
        await db.insert(schema.usuarios).values({
          nome: u.name || "Usuário EduMarket",
          email: u.email,
          senha: "encrypted_by_auth", // O Better Auth já guarda a senha real criptografada na tabela 'account'
          tipo: "consumidor",         // Define um tipo padrão exigido (pode ser editado depois no PUT /perfil)
          foto: null,
        });
        console.log(`✅ Perfil complementar criado para: ${u.email}`);
      } catch (error) {
        console.error("❌ Erro ao espelhar usuário na tabela complementar:", error);
        throw error;
      }
    },
  },
});