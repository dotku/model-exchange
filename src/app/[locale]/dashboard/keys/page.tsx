import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { auth0 } from "@/lib/auth0";
import { getOrCreateUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KeysContent from "@/components/KeysContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "keys" });
  return { title: t("metaTitle") };
}

export default async function KeysPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth0.getSession();
  if (!session) redirect(`/auth/login?returnTo=/${locale}/dashboard/keys`);

  const user = await getOrCreateUser();
  if (!user) redirect(`/auth/login?returnTo=/${locale}/dashboard/keys`);

  const [apiKeys, providerKeys] = await Promise.all([
    prisma.apiKey.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.providerKey.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <>
      <Navbar user={session.user} />
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <KeysContent
            apiKeys={apiKeys.map((k) => ({
              id: k.id,
              name: k.name,
              keyPrefix: k.keyPrefix,
              isActive: k.isActive,
              lastUsed: k.lastUsed?.toISOString() ?? null,
              createdAt: k.createdAt.toISOString(),
            }))}
            providerKeys={providerKeys.map((k) => ({
              id: k.id,
              providerName: k.providerName,
              label: k.label,
              endpointUrl: k.endpointUrl,
              isActive: k.isActive,
              lastUsed: k.lastUsed?.toISOString() ?? null,
              createdAt: k.createdAt.toISOString(),
            }))}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
