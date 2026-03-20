import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { auth0 } from "@/lib/auth0";
import { getOrCreateUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardContent from "@/components/DashboardContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { title: t("metaTitle") };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth0.getSession();
  if (!session) {
    redirect(`/auth/login?returnTo=/${locale}/dashboard`);
  }

  const user = await getOrCreateUser();
  if (!user) redirect(`/auth/login?returnTo=/${locale}/dashboard`);

  const models = await prisma.aIModel.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar user={session.user} />
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <DashboardContent
            models={models.map((m) => ({
              ...m,
              createdAt: m.createdAt.toISOString(),
              updatedAt: m.updatedAt.toISOString(),
            }))}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
