"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavbarProps {
  user?: { name?: string | null; picture?: string | null } | null;
}

export default function Navbar({ user }: NavbarProps = {}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">MX</span>
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            {t("brand")}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href={`/${locale}#models`}
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {t("models")}
          </Link>
          <Link
            href={`/${locale}/pricing`}
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {t("pricing")}
          </Link>
          <Link
            href={`/${locale}/leaderboard`}
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {t("leaderboard")}
          </Link>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/dashboard`}
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {t("dashboard")}
              </Link>
              <Link
                href={`/${locale}/dashboard/keys`}
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {t("apiKeys")}
              </Link>
              <Link
                href={`/${locale}/dashboard/usage`}
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {t("usage")}
              </Link>
              <div className="flex items-center gap-2">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-7 w-7 rounded-full"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-medium text-indigo-600 dark:text-indigo-300">
                    {(user.name ?? "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {user.name}
                </span>
              </div>
              <a
                href="/auth/logout"
                className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {t("logout")}
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="/auth/login"
                className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {t("login")}
              </a>
              <a
                href="/auth/login?screen_hint=signup"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                {t("signup")}
              </a>
            </div>
          )}
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
          <Link
            href={`/${locale}#models`}
            className="block text-sm text-zinc-600 dark:text-zinc-400"
          >
            {t("models")}
          </Link>
          <Link
            href={`/${locale}/pricing`}
            className="block text-sm text-zinc-600 dark:text-zinc-400"
          >
            {t("pricing")}
          </Link>
          <Link
            href={`/${locale}/leaderboard`}
            className="block text-sm text-zinc-600 dark:text-zinc-400"
          >
            {t("leaderboard")}
          </Link>
          <div className="flex flex-col gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <LanguageSwitcher />
            {user ? (
              <>
                <Link
                  href={`/${locale}/dashboard`}
                  className="text-sm text-zinc-600 dark:text-zinc-400"
                >
                  {t("dashboard")}
                </Link>
                <Link
                  href={`/${locale}/dashboard/keys`}
                  className="text-sm text-zinc-600 dark:text-zinc-400"
                >
                  {t("apiKeys")}
                </Link>
                <Link
                  href={`/${locale}/dashboard/usage`}
                  className="text-sm text-zinc-600 dark:text-zinc-400"
                >
                  {t("usage")}
                </Link>
                <div className="flex items-center gap-2">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-medium text-indigo-600 dark:text-indigo-300">
                      {(user.name ?? "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {user.name}
                  </span>
                </div>
                <a
                  href="/auth/logout"
                  className="text-sm text-zinc-600 dark:text-zinc-400"
                >
                  {t("logout")}
                </a>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/auth/login"
                  className="flex-1 text-center rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {t("login")}
                </a>
                <a
                  href="/auth/login?screen_hint=signup"
                  className="flex-1 text-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                >
                  {t("signup")}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
