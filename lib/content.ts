import "server-only";
import { Redis } from "@upstash/redis";
import { promises as fs } from "node:fs";
import path from "node:path";
import { ContentSchema, type Content } from "./schema";

const CONTENT_KEY = "portfolio:content";
const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

function getRedis() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

async function getDefault(): Promise<Content> {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  return ContentSchema.parse(JSON.parse(raw));
}

export async function readContent(): Promise<Content> {
  const redis = getRedis();
  if (redis) {
    const stored = await redis.get<unknown>(CONTENT_KEY);
    if (stored) return ContentSchema.parse(stored);
  }
  return getDefault();
}

export async function writeContent(next: unknown): Promise<Content> {
  const parsed = ContentSchema.parse(next);
  const redis = getRedis();
  if (!redis) throw new Error("Redis not configured");
  await redis.set(CONTENT_KEY, JSON.stringify(parsed));
  return parsed;
}
