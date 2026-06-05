import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { profiles, user, session, account, verification } from "./db/schema";

export const auth = betterAuth({
  baseURL: "http://localhost:3333",
  trustedOrigins: ["http://localhost:3333", "http://localhost:3000"],

  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { user, session, account, verification },
  }),

  emailAndPassword: {
    enabled: true,

    async onSignUp(ctx: any) {
      const u = ctx.user;
      try {
        await db.insert(profiles).values({
          userId: u.id,
          nome: u.name || u.email.split("@")[0],
          tipo: "consumidor",
          foto: null,
        });
      } catch (error) {
        console.error("❌ Erro ao criar perfil:", error);
        throw error;
      }
    },
  },
});