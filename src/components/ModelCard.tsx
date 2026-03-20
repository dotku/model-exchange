import { useTranslations } from "next-intl";
import type { Model } from "@/data/models";

export default function ModelCard({ model }: { model: Model }) {
  const t = useTranslations("models");

  return (
    <div className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200">
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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
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

      {/* Pricing */}
      <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3 mb-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("input")}
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              ${model.inputPrice}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("output")}
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              ${model.outputPrice}
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
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          {t("perMillionTokens")}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
          {t("viewDetails")}
        </button>
        <button className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
          {t("contactProvider")}
        </button>
      </div>
    </div>
  );
}
