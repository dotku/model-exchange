import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return { title: t("metaTitle") };
}

export default function TermsPage() {
  const t = useTranslations("terms");

  return (
    <LegalPageLayout>
      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          {t("title")}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-10">
          {t("lastUpdated")}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
            {t("s1Title")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("s1Content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
            {t("s2Title")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("s2Content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
            {t("s3Title")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("s3Content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
            {t("s4Title")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("s4Content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
            {t("s5Title")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("s5Content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
            {t("s6Title")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("s6Content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
            {t("s7Title")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("s7Content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
            {t("s8Title")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("s8Content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
            {t("s9Title")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("s9Content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
            {t("s10Title")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("s10Content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
            {t("s11Title")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("s11Content")}
          </p>
        </section>
      </article>
    </LegalPageLayout>
  );
}
