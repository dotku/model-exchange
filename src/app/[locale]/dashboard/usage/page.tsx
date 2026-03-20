import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { auth0 } from "@/lib/auth0";
import { getOrCreateUser } from "@/lib/user";
import { getUserUsageStats } from "@/lib/usage-logger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UsageContent from "@/components/UsageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "usage" });
  return { title: t("metaTitle") };
}

export default async function UsagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth0.getSession();
  if (!session) redirect(`/auth/login?returnTo=/${locale}/dashboard/usage`);

  const user = await getOrCreateUser();
  if (!user) redirect(`/auth/login?returnTo=/${locale}/dashboard/usage`);

  const stats = await getUserUsageStats(user.id, 30);

  return (
    <>
      <Navbar user={session.user} />
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
          <UsageContent stats={stats} />
        </div>
      </main>
      <Footer />
    </>
  );
}
