"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">MX</span>
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            {t("brand")}
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#models"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {t("models")}
          </a>
          <a
            href="#pricing"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {t("pricing")}
          </a>
          <a
            href="#"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {t("docs")}
          </a>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <a
            href="#"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            {t("listModel")}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-zinc-600 dark:text-zinc-400"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-4">
          <a
            href="#models"
            className="block text-sm text-zinc-600 dark:text-zinc-400"
          >
            {t("models")}
          </a>
          <a
            href="#pricing"
            className="block text-sm text-zinc-600 dark:text-zinc-400"
          >
            {t("pricing")}
          </a>
          <a
            href="#"
            className="block text-sm text-zinc-600 dark:text-zinc-400"
          >
            {t("docs")}
          </a>
          <div className="flex items-center justify-between pt-2">
            <LanguageSwitcher />
            <a
              href="#"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
            >
              {t("listModel")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
