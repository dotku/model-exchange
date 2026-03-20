import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-100 dark:bg-indigo-950/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-100 dark:bg-purple-950/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-6">
            {t("badge")}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {t("title")}
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#models"
              className="w-full sm:w-auto rounded-lg bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-colors"
            >
              {t("browseModels")}
            </a>
            <a
              href="#"
              className="w-full sm:w-auto rounded-lg border border-zinc-300 dark:border-zinc-700 px-8 py-3 text-base font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {t("listYourModel")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
