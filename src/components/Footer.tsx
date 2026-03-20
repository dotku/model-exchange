import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">MX</span>
              </div>
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                {nav("brand")}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("tagline")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
              {t("product")}
            </h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <a href="#models" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  {nav("models")}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  {nav("pricing")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  {nav("docs")}
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
              {t("company")}
            </h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
              {t("legal")}
            </h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} Model Exchange. {t("allRightsReserved")}
        </div>
      </div>
    </footer>
  );
}
