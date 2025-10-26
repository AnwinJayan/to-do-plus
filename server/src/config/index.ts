import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().optional(),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  NODE_ENV: z.string().default("development"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  FRONTEND_URL: z.string().url().min(1, "FRONTEND_URL is required"),
});

let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error: any) {
  console.error("Environment variable validation failed:", error.errors);
  process.exit(1);
}

const config = {
  port: env.PORT ? Number(env.PORT) : 5000,
  frontendUrl: env.FRONTEND_URL,
  mongoUri: env.MONGO_URI,
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * (env.NODE_ENV === "production" ? 1 : 7),
    sameSite: "lax",
  },
  nodeEnv: env.NODE_ENV,
  geminiApiKey: env.GEMINI_API_KEY,
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },
};

export default config;
