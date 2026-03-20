import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { models as sampleModels, type ProviderOffering } from "@/data/models";
import { PLATFORM_FEE_RATE, calculateFees } from "@/lib/platform";
import { formatTokenCount } from "@/lib/format";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

async function getModel(id: string) {
  // Check sample models first
  const sample = sampleModels.find((m) => m.id === id);
  if (sample) {
    return {
      ...sample,
      isSample: true as const,
      providerUser: null,
    };
  }

  // Check DB models
  const dbModel = await prisma.aIModel.findFirst({
    where: { id, isPublished: true },
    include: {
      user: { select: { name: true, email: true, picture: true } },
    },
  });

  if (!dbModel) return null;

  return {
    id: dbModel.id,
    name: dbModel.name,
    provider: dbModel.provider,
    description: dbModel.description,
    contextWindow: dbModel.contextWindow,
    inputPrice: dbModel.inputPrice,
    outputPrice: dbModel.outputPrice,
    tags: dbModel.tags,
    freeTokens: dbModel.freeTokens,
    speed: dbModel.speed,
    apiDocsUrl: dbModel.apiDocsUrl,
    billingType: dbModel.billingType as "platform" | "external",
    isPartner: false,
    maintainedBy: undefined as string | undefined,
    offerings: undefined as ProviderOffering[] | undefined,
    isSample: false as const,
    providerUser: dbModel.user,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const model = await getModel(id);
  if (!model) return { title: "Not Found" };
  const t = await getTranslations({ locale, namespace: "modelDetail" });
  return { title: `${model.name} - ${t("metaTitleSuffix")}` };
}

export default async function ModelDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const model = await getModel(id);
  if (!model) notFound();

  const session = await auth0.getSession();
  const t = await getTranslations({ locale, namespace: "modelDetail" });

  return (
    <>
      <Navbar user={session?.user ?? null} />
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
            <Link
              href={`/${locale}`}
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {t("home")}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/${locale}#models`}
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {t("models")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-900 dark:text-white">{model.name}</span>
          </nav>

          {/* Header */}
          <div className={`rounded-xl border bg-white dark:bg-zinc-900 p-6 sm:p-8 mb-6 ${
            model.isPartner
              ? "border-amber-300 dark:border-amber-700 ring-1 ring-amber-200 dark:ring-amber-800/50"
              : "border-zinc-200 dark:border-zinc-800"
          }`}>
            {/* Partner Banner */}
            {model.isPartner && (
              <div className="flex flex-wrap items-center gap-2 mb-4 -mt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 px-3 py-1 text-sm font-semibold text-amber-800 dark:text-amber-200">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {t("officialPartner")}
                </span>
                {model.maintainedBy && (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t("maintainedBy", { name: model.maintainedBy })}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    model.isPartner
                      ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
                      : "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                  }`}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                      {model.name}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      {t("by")} {model.provider}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {model.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base">
              {model.description}
            </p>
          </div>

          {/* Pricing Card */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {t("pricing")}
              </h2>
              {model.inputPrice === 0 && model.outputPrice === 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t("freeModelBadge")}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                  {t("inputPrice")}
                </p>
                <p className={`text-2xl font-bold ${model.inputPrice === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white"}`}>
                  {model.inputPrice === 0 ? t("free") : `$${model.inputPrice}`}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {t("perMillionTokens")}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                  {t("outputPrice")}
                </p>
                <p className={`text-2xl font-bold ${model.outputPrice === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white"}`}>
                  {model.outputPrice === 0 ? t("free") : `$${model.outputPrice}`}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {t("perMillionTokens")}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                  {t("contextWindow")}
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {model.contextWindow}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  tokens
                </p>
              </div>
            </div>

            {/* Free Tier */}
            {model.freeTokens != null && model.freeTokens > 0 && (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50 shrink-0">
                  <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-emerald-800 dark:text-emerald-200">
                    {t("freeTier")}
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    {t("freeTierDesc", { count: formatTokenCount(model.freeTokens) })}
                  </p>
                </div>
              </div>
            )}

            {/* Billing Info — hide for free models */}
            {!model.isSample && (model.inputPrice > 0 || model.outputPrice > 0) && (
              <div className="mt-4 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
                {model.billingType === "platform" ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                        {t("billingViaPlatform")}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                      {t("billingPlatformInfo", { rate: `${Math.round(PLATFORM_FEE_RATE * 100)}%` })}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-md bg-zinc-50 dark:bg-zinc-800/50 p-3">
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">{t("inputFeeBreakdown")}</p>
                        <p className="text-zinc-900 dark:text-white font-medium">
                          ${model.inputPrice} → {t("providerGets")} ${calculateFees(model.inputPrice).providerRevenue}
                        </p>
                      </div>
                      <div className="rounded-md bg-zinc-50 dark:bg-zinc-800/50 p-3">
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">{t("outputFeeBreakdown")}</p>
                        <p className="text-zinc-900 dark:text-white font-medium">
                          ${model.outputPrice} → {t("providerGets")} ${calculateFees(model.outputPrice).providerRevenue}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      {t("billingExternal")}
                    </span>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {t("billingExternalInfo")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Start — for free models, show keyless usage */}
          {model.inputPrice === 0 && model.outputPrice === 0 && (
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-6 sm:p-8 mb-6">
              <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                {t("quickStart")}
              </h2>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
                {t("quickStartFreeDesc")}
              </p>
              <div className="rounded-lg bg-zinc-900 dark:bg-zinc-800 p-4 overflow-x-auto">
                <pre className="text-sm text-emerald-300 font-mono whitespace-pre">{`curl https://api.modelexchange.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model.name}",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}</pre>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3">
                {t("quickStartNoKey")}
              </p>
            </div>
          )}

          {/* Provider Offerings */}
          {model.offerings && model.offerings.length > 0 && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 mb-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
                {t("availableProviders")}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                {t("availableProvidersDesc")}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-700">
                      <th className="text-left py-3 px-3 font-medium text-zinc-500 dark:text-zinc-400">{t("offeringProvider")}</th>
                      <th className="text-left py-3 px-3 font-medium text-zinc-500 dark:text-zinc-400">{t("offeringSpeed")}</th>
                      <th className="text-right py-3 px-3 font-medium text-zinc-500 dark:text-zinc-400">{t("offeringInput")}</th>
                      <th className="text-right py-3 px-3 font-medium text-zinc-500 dark:text-zinc-400">{t("offeringOutput")}</th>
                      <th className="text-right py-3 px-3 font-medium text-zinc-500 dark:text-zinc-400">{t("offeringFree")}</th>
                      <th className="text-center py-3 px-3 font-medium text-zinc-500 dark:text-zinc-400">{t("offeringDocs")}</th>
                      <th className="text-left py-3 px-3 font-medium text-zinc-500 dark:text-zinc-400">{t("offeringNote")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {model.offerings.map((offering, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-3 px-3 font-medium text-zinc-900 dark:text-white">
                          {offering.providerName}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            offering.speed === "fast"
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                              : offering.speed === "economy"
                              ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          }`}>
                            {t(`speed_${offering.speed}`)}
                          </span>
                        </td>
                        <td className={`py-3 px-3 text-right ${offering.inputPrice === 0 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-zinc-900 dark:text-white"}`}>
                          {offering.inputPrice === 0 ? t("free") : `$${offering.inputPrice}`}
                        </td>
                        <td className={`py-3 px-3 text-right ${offering.outputPrice === 0 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-zinc-900 dark:text-white"}`}>
                          {offering.outputPrice === 0 ? t("free") : `$${offering.outputPrice}`}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {offering.freeTokens ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              {formatTokenCount(offering.freeTokens)}
                            </span>
                          ) : (
                            <span className="text-zinc-400 dark:text-zinc-500">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {offering.apiDocsUrl ? (
                            <a
                              href={offering.apiDocsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs font-medium"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                              API
                            </a>
                          ) : (
                            <span className="text-zinc-400 dark:text-zinc-500">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-zinc-500 dark:text-zinc-400 text-xs">
                          {offering.note ?? ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">{t("pricePerMillion")}</p>
            </div>
          )}

          {/* Provider / Contact */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              {t("providerInfo")}
            </h2>

            {model.isSample ? (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-500 dark:text-zinc-400">
                    {model.provider.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {model.provider}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {t("officialProvider")}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                  {t("sampleProviderDesc", { provider: model.provider })}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  {t("visitProviderSite")}
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Model Provider */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide">
                    {t("modelProvider")}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-500 dark:text-zinc-400">
                      {model.provider.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {model.provider}
                      </p>
                      {model.apiDocsUrl && (
                        <a
                          href={model.apiDocsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          {t("apiDocs")}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-200 dark:border-zinc-800" />

                {/* Submitter */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide">
                    {t("submittedBy")}
                  </h3>
                  <div className="flex items-center gap-4">
                    {model.providerUser?.picture ? (
                      <img
                        src={model.providerUser.picture}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-300">
                        {(model.providerUser?.name ?? "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {model.providerUser?.name ?? t("anonymousSubmitter")}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {t("communitySubmitter")}
                      </p>
                    </div>
                  </div>
                  {model.providerUser?.email && (
                    <a
                      href={`mailto:${model.providerUser.email}?subject=${encodeURIComponent(`Inquiry about ${model.name} on Model Exchange`)}`}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      {t("contactViaEmail")}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Back */}
          <div className="mt-8">
            <Link
              href={`/${locale}#models`}
              className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t("backToModels")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
