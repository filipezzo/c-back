import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatório."),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  JWT_SECRET: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
});

const env = schema.parse(process.env);

export const NODE_ENV = env.NODE_ENV;
export const isProd = env.NODE_ENV === "production";

if (isProd && !env.JWT_SECRET) {
  throw new Error("JWT_SECRET é obrigatório em produção. Defina um .env");
}

export const JWT_SECRET = env.JWT_SECRET ?? "dev-secret-change-me";
export const CORS_ORIGINS = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : undefined;
