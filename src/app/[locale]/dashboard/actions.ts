"use server";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";
import { redirect } from "next/navigation";

export async function createModel(formData: FormData) {
  const user = await getOrCreateUser();
  if (!user) redirect("/auth/login");

  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await prisma.aIModel.create({
    data: {
      name: formData.get("name") as string,
      provider: formData.get("provider") as string,
      description: formData.get("description") as string,
      contextWindow: formData.get("contextWindow") as string,
      inputPrice: parseFloat(formData.get("inputPrice") as string),
      outputPrice: parseFloat(formData.get("outputPrice") as string),
      tags,
      freeTokens: parseFreeTokens(formData.get("freeTokens") as string),
      isPublished: formData.get("isPublished") === "on",
      userId: user.id,
    },
  });
}

function parseFreeTokens(value: string | null): number | null {
  if (!value || value.trim() === "") return null;
  const num = parseInt(value, 10);
  return isNaN(num) || num <= 0 ? null : num;
}

export async function updateModel(modelId: string, formData: FormData) {
  const user = await getOrCreateUser();
  if (!user) redirect("/auth/login");

  const existing = await prisma.aIModel.findFirst({
    where: { id: modelId, userId: user.id },
  });
  if (!existing) throw new Error("Model not found");

  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await prisma.aIModel.update({
    where: { id: modelId },
    data: {
      name: formData.get("name") as string,
      provider: formData.get("provider") as string,
      description: formData.get("description") as string,
      contextWindow: formData.get("contextWindow") as string,
      inputPrice: parseFloat(formData.get("inputPrice") as string),
      outputPrice: parseFloat(formData.get("outputPrice") as string),
      tags,
      freeTokens: parseFreeTokens(formData.get("freeTokens") as string),
      isPublished: formData.get("isPublished") === "on",
    },
  });
}

export async function deleteModel(modelId: string) {
  const user = await getOrCreateUser();
  if (!user) redirect("/auth/login");

  const existing = await prisma.aIModel.findFirst({
    where: { id: modelId, userId: user.id },
  });
  if (!existing) throw new Error("Model not found");

  await prisma.aIModel.delete({ where: { id: modelId } });
}

export async function togglePublish(modelId: string) {
  const user = await getOrCreateUser();
  if (!user) redirect("/auth/login");

  const existing = await prisma.aIModel.findFirst({
    where: { id: modelId, userId: user.id },
  });
  if (!existing) throw new Error("Model not found");

  await prisma.aIModel.update({
    where: { id: modelId },
    data: { isPublished: !existing.isPublished },
  });
}
