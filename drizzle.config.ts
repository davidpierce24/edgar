import { file } from "bun";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite", // "mysql" | "sqlite" | "postgresql"
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "./db/local.sqlite",
  },
});