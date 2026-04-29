import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { ContentSchema, type Content } from "./schema";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export async function readContent(): Promise<Content> {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  const json = JSON.parse(raw);
  return ContentSchema.parse(json);
}

export async function writeContent(next: unknown): Promise<Content> {
  const parsed = ContentSchema.parse(next);
  await fs.writeFile(CONTENT_PATH, JSON.stringify(parsed, null, 2), "utf-8");
  return parsed;
}
