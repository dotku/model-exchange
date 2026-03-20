import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import type { Model } from "@/data/models";
import { formatTokenCount } from "@/lib/format";

export default function ModelCard({ model }: { model: Model }) {
  const t = useTranslations("models");
  const locale = useLocale();
  const detailHref = `/${locale}/models/${model.id}`;

  return (
    <div className={`group rounded-xl border bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all duration-200 ${
      model.isPartner
        ? "border-amber-300 dark:border-amber-700 ring-1 ring-amber-200 dark:ring-amber-800/50 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-amber-500/10"
        : "border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-indigo-500/5"
    }`}>
      {/* Partner Badge */}
      {model.isPartner && (
        <div className="flex items-center gap-1.5 mb-3 -mt-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-200">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {t("officialPartner")}
          </span>
          {model.maintainedBy && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("maintainedBy", { name: model.maintainedBy })}
            </span>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {model.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {model.provider}
          </p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          model.isPartner
            ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
            : "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
        }`}>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
            />
          </svg>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
        {model.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {model.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Free Model Badge */}
      {model.inputPrice === 0 && model.outputPrice === 0 ? (
        <div className="flex items-center gap-1.5 mb-4 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
          <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {t("freeModel")}
          </span>
        </div>
      ) : (
        <>
          {/* Free Tier */}
          {model.freeTokens != null && model.freeTokens > 0 && (
            <div className="flex items-center gap-1.5 mb-4 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                {t("freeTokens", { count: formatTokenCount(model.freeTokens) })}
              </span>
            </div>
          )}
        </>
      )}

      {/* Pricing */}
      <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3 mb-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("input")}
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {model.inputPrice === 0 ? t("free") : `$${model.inputPrice}`}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("output")}
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {model.outputPrice === 0 ? t("free") : `$${model.outputPrice}`}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("context")}
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {model.contextWindow}
            </p>
          </div>
        </div>
        {(model.inputPrice > 0 || model.outputPrice > 0) && (
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            {t("perMillionTokens")}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={detailHref}
          className="flex-1 text-center rounded-lg border border-zinc-200 dark:border-zinc-700 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          {t("viewDetails")}
        </Link>
        <Link
          href={detailHref}
          className="flex-1 text-center rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          {t("contactProvider")}
        </Link>
      </div>
    </div>
  );
}
