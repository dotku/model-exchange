import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { auth0 } from "@/lib/auth0";
import { PLATFORM_FEE_RATE, PROVIDER_REVENUE_RATE } from "@/lib/platform";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricingPage" });
  return { title: t("metaTitle") };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth0.getSession();
  const t = await getTranslations({ locale, namespace: "pricingPage" });

  const feePercent = Math.round(PLATFORM_FEE_RATE * 100);
  const revenuePercent = Math.round(PROVIDER_REVENUE_RATE * 100);

  return (
    <>
      <Navbar user={session?.user ?? null} />
      <main className="flex-1 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          {/* Two options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Platform Billing */}
            <div className="rounded-xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-900 p-8 relative">
              <span className="absolute -top-3 left-6 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                {t("recommended")}
              </span>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {t("platformBillingTitle")}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                {t("platformBillingDesc")}
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-indigo-600">{feePercent}%</span>
                <span className="text-zinc-500 dark:text-zinc-400">{t("platformFee")}</span>
              </div>

              <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 p-4 mb-6">
                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-1">
                  {t("providerKeeps", { percent: revenuePercent.toString() })}
                </p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400">
                  {t("example")}: $10/1M tokens → {t("providerGets")} ${(10 * PROVIDER_REVENUE_RATE).toFixed(2)}, {t("platformGets")} ${(10 * PLATFORM_FEE_RATE).toFixed(2)}
                </p>
              </div>

              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {t("featurePaymentProcessing")}
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {t("featureUsageTracking")}
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {t("featureAutoInvoicing")}
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {t("featureDisputeResolution")}
                </li>
              </ul>
            </div>

            {/* External Billing */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {t("externalBillingTitle")}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                {t("externalBillingDesc")}
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">{t("free")}</span>
                <span className="text-zinc-500 dark:text-zinc-400">{t("listingFee")}</span>
              </div>

              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4 mb-6">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  {t("youKeep100")}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t("externalBillingNote")}
                </p>
              </div>

              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {t("featureFreeListing")}
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {t("featureOwnBilling")}
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {t("featureDirectRelationship")}
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {t("featureMarketplaceExposure")}
                </li>
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">
              {t("faqTitle")}
            </h2>
            <div className="space-y-4">
              {(["faq1", "faq2", "faq3"] as const).map((faq) => (
                <div key={faq} className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-5">
                  <h3 className="font-medium text-zinc-900 dark:text-white mb-2">
                    {t(`${faq}Q`)}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t(`${faq}A`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
