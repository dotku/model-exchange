"use server";

import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";
import { redirect } from "next/navigation";

function hashKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

function generateApiKey(): string {
  return `mx_${crypto.randomBytes(32).toString("hex")}`;
}

// Simple encryption for storing provider keys — in production use a KMS
const ENCRYPTION_KEY = (process.env.AUTH0_SECRET ?? "fallback-key-for-dev").slice(0, 32).padEnd(32, "0");

function encryptValue(value: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decryptValue(encrypted: string): string {
  const [ivHex, data] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// ── MX API Keys ──

export async function createApiKey(formData: FormData) {
  const user = await getOrCreateUser();
  if (!user) redirect("/auth/login");

  const name = formData.get("name") as string;
  const rawKey = generateApiKey();

  await prisma.apiKey.create({
    data: {
      name,
      keyHash: hashKey(rawKey),
      keyPrefix: rawKey.slice(0, 10),
      userId: user.id,
    },
  });

  // Return the raw key — only shown once
  return rawKey;
}

export async function deleteApiKey(keyId: string) {
  const user = await getOrCreateUser();
  if (!user) redirect("/auth/login");

  const key = await prisma.apiKey.findFirst({ where: { id: keyId, userId: user.id } });
  if (!key) throw new Error("Key not found");

  await prisma.apiKey.delete({ where: { id: keyId } });
}

export async function toggleApiKey(keyId: string) {
  const user = await getOrCreateUser();
  if (!user) redirect("/auth/login");

  const key = await prisma.apiKey.findFirst({ where: { id: keyId, userId: user.id } });
  if (!key) throw new Error("Key not found");

  await prisma.apiKey.update({
    where: { id: keyId },
    data: { isActive: !key.isActive },
  });
}

// ── BYOK Provider Keys ──

export async function addProviderKey(formData: FormData) {
  const user = await getOrCreateUser();
  if (!user) redirect("/auth/login");

  const providerName = formData.get("providerName") as string;
  const label = formData.get("label") as string;
  const apiKey = (formData.get("apiKey") as string) || "";
  const endpointUrl = (formData.get("endpointUrl") as string) || null;

  await prisma.providerKey.create({
    data: {
      providerName,
      label,
      encryptedKey: apiKey ? encryptValue(apiKey) : "",
      endpointUrl,
      userId: user.id,
    },
  });
}

export async function updateProviderKey(keyId: string, formData: FormData) {
  const user = await getOrCreateUser();
  if (!user) redirect("/auth/login");

  const key = await prisma.providerKey.findFirst({ where: { id: keyId, userId: user.id } });
  if (!key) throw new Error("Key not found");

  const data: Record<string, unknown> = {
    providerName: formData.get("providerName") as string,
    label: formData.get("label") as string,
    endpointUrl: (formData.get("endpointUrl") as string) || null,
  };

  const newApiKey = formData.get("apiKey") as string;
  if (newApiKey) {
    data.encryptedKey = encryptValue(newApiKey);
  }

  await prisma.providerKey.update({ where: { id: keyId }, data });
}

export async function deleteProviderKey(keyId: string) {
  const user = await getOrCreateUser();
  if (!user) redirect("/auth/login");

  const key = await prisma.providerKey.findFirst({ where: { id: keyId, userId: user.id } });
  if (!key) throw new Error("Key not found");

  await prisma.providerKey.delete({ where: { id: keyId } });
}

export async function toggleProviderKey(keyId: string) {
  const user = await getOrCreateUser();
  if (!user) redirect("/auth/login");

  const key = await prisma.providerKey.findFirst({ where: { id: keyId, userId: user.id } });
  if (!key) throw new Error("Key not found");

  await prisma.providerKey.update({
    where: { id: keyId },
    data: { isActive: !key.isActive },
  });
}

// decryptValue is kept private — used internally for gateway routing
