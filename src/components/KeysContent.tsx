"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useTransition } from "react";
import Link from "next/link";
import {
  createApiKey,
  deleteApiKey,
  toggleApiKey,
  addProviderKey,
  deleteProviderKey,
  toggleProviderKey,
} from "@/app/[locale]/dashboard/keys/actions";
import {
  runBenchmark,
  runAndPublishBenchmark,
  type BenchmarkResult,
} from "@/app/[locale]/dashboard/keys/benchmark-action";
import { useRouter } from "next/navigation";

interface ApiKeyData {
  id: string;
  name: string;
  keyPrefix: string;
  isActive: boolean;
  lastUsed: string | null;
  createdAt: string;
}

interface ProviderKeyData {
  id: string;
  providerName: string;
  label: string;
  endpointUrl: string | null;
  isActive: boolean;
  lastUsed: string | null;
  createdAt: string;
}

export default function KeysContent({
  apiKeys,
  providerKeys,
}: {
  apiKeys: ApiKeyData[];
  providerKeys: ProviderKeyData[];
}) {
  const t = useTranslations("keys");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // MX key states
  const [showNewKey, setShowNewKey] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  // BYOK states
  const [showProviderForm, setShowProviderForm] = useState(false);

  // Benchmark states
  const [benchmarkingId, setBenchmarkingId] = useState<string | null>(null);
  const [benchmarkModelId, setBenchmarkModelId] = useState<string>("");
  const [benchmarkResult, setBenchmarkResult] = useState<Record<string, BenchmarkResult | null>>({});
  const [showBenchmarkForm, setShowBenchmarkForm] = useState<string | null>(null);

  function handleCreateApiKey(formData: FormData) {
    startTransition(async () => {
      const key = await createApiKey(formData);
      setRevealedKey(key);
      setShowNewKey(false);
      router.refresh();
    });
  }

  function handleDeleteApiKey(id: string) {
    if (!confirm(t("confirmDeleteKey"))) return;
    startTransition(async () => {
      await deleteApiKey(id);
      router.refresh();
    });
  }

  function handleToggleApiKey(id: string) {
    startTransition(async () => {
      await toggleApiKey(id);
      router.refresh();
    });
  }

  function handleAddProviderKey(formData: FormData) {
    startTransition(async () => {
      await addProviderKey(formData);
      setShowProviderForm(false);
      router.refresh();
    });
  }

  function handleDeleteProviderKey(id: string) {
    if (!confirm(t("confirmDeleteKey"))) return;
    startTransition(async () => {
      await deleteProviderKey(id);
      router.refresh();
    });
  }

  function handleToggleProviderKey(id: string) {
    startTransition(async () => {
      await toggleProviderKey(id);
      router.refresh();
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <Link
          href={`/${locale}/dashboard`}
          className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          {t("backToDashboard")}
        </Link>
      </div>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        {t("subtitle")}
      </p>

      {/* Gateway Info Banner */}
      <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30 p-5 mb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50 shrink-0 mt-0.5">
            <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">{t("gatewayTitle")}</h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">{t("gatewayDesc")}</p>
            <code className="block text-xs bg-indigo-100 dark:bg-indigo-900/50 rounded-md px-3 py-2 text-indigo-800 dark:text-indigo-200 font-mono">
              POST https://api.modelexchange.ai/v1/chat/completions
              <br />
              {`{"model": "sienovo/smollm", "messages": [...]}`}
            </code>
          </div>
        </div>
      </div>

      {/* Free models notice */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4 mb-8">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{t("freeModelsTitle")}</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">{t("freeModelsDesc")}</p>
          </div>
        </div>
      </div>

      {/* ── Section 1: MX API Keys ── */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{t("mxKeysTitle")}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("mxKeysDesc")}</p>
          </div>
          <button
            onClick={() => { setShowNewKey(true); setRevealedKey(null); }}
            disabled={isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t("createKey")}
          </button>
        </div>

        {/* Revealed key banner */}
        {revealedKey && (
          <div className="mb-4 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-4">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">{t("keyCreated")}</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white dark:bg-zinc-900 rounded-md px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white border border-amber-200 dark:border-amber-800 break-all">
                {revealedKey}
              </code>
              <button
                onClick={() => { navigator.clipboard.writeText(revealedKey); }}
                className="shrink-0 rounded-lg border border-zinc-200 dark:border-zinc-700 p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">{t("keyOnlyOnce")}</p>
          </div>
        )}

        {/* New key form */}
        {showNewKey && (
          <form action={handleCreateApiKey} className="mb-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t("keyName")}</label>
              <input
                name="name"
                required
                placeholder={t("keyNamePlaceholder")}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
              {t("generate")}
            </button>
            <button type="button" onClick={() => setShowNewKey(false)} className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">
              {t("cancel")}
            </button>
          </form>
        )}

        {/* Keys list */}
        {apiKeys.length === 0 && !showNewKey ? (
          <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-8 text-center">
            <svg className="mx-auto h-10 w-10 text-zinc-400 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("noMxKeys")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {apiKeys.map((key) => (
              <div key={key.id} className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${key.isActive ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"}`} />
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{key.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{key.keyPrefix}•••••••••</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggleApiKey(key.id)} disabled={isPending} className="rounded border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50">
                    {key.isActive ? t("disable") : t("enable")}
                  </button>
                  <button onClick={() => handleDeleteApiKey(key.id)} disabled={isPending} className="rounded border border-red-200 dark:border-red-900 px-2.5 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50">
                    {t("delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Section 2: BYOK Provider Keys ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{t("byokTitle")}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("byokDesc")}</p>
          </div>
          <button
            onClick={() => setShowProviderForm(true)}
            disabled={isPending}
            className="rounded-lg bg-zinc-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t("addKey")}
          </button>
        </div>

        {/* Add provider key form */}
        {showProviderForm && (
          <div className="mb-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">{t("addProviderKey")}</h3>
            <form action={handleAddProviderKey} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t("provider")}</label>
                  <input name="providerName" required placeholder="e.g. OpenAI, Anthropic" className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t("label")}</label>
                  <input name="label" required placeholder={t("labelPlaceholder")} className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  {t("apiKeyField")} <span className="text-zinc-400">({t("optional")})</span>
                </label>
                <input name="apiKey" type="password" placeholder="sk-•••••••• (leave empty for free services)" className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                <p className="text-xs text-zinc-400 mt-1">{t("apiKeyOptionalHint")}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  {t("endpointUrl")} <span className="text-zinc-400">({t("optional")})</span>
                </label>
                <input name="endpointUrl" type="url" placeholder="https://api.openai.com/v1" className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                <p className="text-xs text-zinc-400 mt-1">{t("endpointHint")}</p>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                  {t("save")}
                </button>
                <button type="button" onClick={() => setShowProviderForm(false)} className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Provider keys list */}
        {providerKeys.length === 0 && !showProviderForm ? (
          <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-8 text-center">
            <svg className="mx-auto h-10 w-10 text-zinc-400 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{t("noProviderKeys")}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">{t("noProviderKeysHint")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {providerKeys.map((key) => (
              <div key={key.id} className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${key.isActive ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{key.label}</p>
                        <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500 dark:text-zinc-400">{key.providerName}</span>
                      </div>
                      {key.endpointUrl && (
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">{key.endpointUrl}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowBenchmarkForm(showBenchmarkForm === key.id ? null : key.id)}
                      disabled={isPending || !key.isActive}
                      className="rounded border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 disabled:opacity-50"
                    >
                      {t("testSpeed")}
                    </button>
                    <button onClick={() => handleToggleProviderKey(key.id)} disabled={isPending} className="rounded border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50">
                      {key.isActive ? t("disable") : t("enable")}
                    </button>
                    <button onClick={() => handleDeleteProviderKey(key.id)} disabled={isPending} className="rounded border border-red-200 dark:border-red-900 px-2.5 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50">
                      {t("delete")}
                    </button>
                  </div>
                </div>

                {/* Benchmark Panel */}
                {showBenchmarkForm === key.id && (
                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">{t("modelToTest")}</label>
                        <input
                          value={benchmarkModelId}
                          onChange={(e) => setBenchmarkModelId(e.target.value)}
                          placeholder={t("modelToTestPlaceholder")}
                          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (!benchmarkModelId.trim()) return;
                          setBenchmarkingId(key.id);
                          setBenchmarkResult((prev) => ({ ...prev, [key.id]: null }));
                          startTransition(async () => {
                            const result = await runBenchmark(key.id, benchmarkModelId);
                            setBenchmarkResult((prev) => ({ ...prev, [key.id]: result }));
                            setBenchmarkingId(null);
                          });
                        }}
                        disabled={isPending || benchmarkingId === key.id || !benchmarkModelId.trim()}
                        className="rounded-lg bg-zinc-900 dark:bg-white px-3 py-1.5 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 whitespace-nowrap"
                      >
                        {benchmarkingId === key.id ? t("testing") : t("runTest")}
                      </button>
                      <button
                        onClick={() => {
                          if (!benchmarkModelId.trim()) return;
                          setBenchmarkingId(key.id);
                          setBenchmarkResult((prev) => ({ ...prev, [key.id]: null }));
                          startTransition(async () => {
                            const result = await runAndPublishBenchmark(key.id, benchmarkModelId);
                            setBenchmarkResult((prev) => ({ ...prev, [key.id]: result }));
                            setBenchmarkingId(null);
                            router.refresh();
                          });
                        }}
                        disabled={isPending || benchmarkingId === key.id || !benchmarkModelId.trim()}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 whitespace-nowrap"
                      >
                        {benchmarkingId === key.id ? t("testing") : t("testAndPublish")}
                      </button>
                    </div>

                    {/* Result */}
                    {benchmarkResult[key.id] && (
                      <div className={`mt-3 rounded-lg p-3 text-sm ${
                        benchmarkResult[key.id]!.success
                          ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
                          : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
                      }`}>
                        {benchmarkResult[key.id]!.success ? (
                          <div className="flex items-center gap-6">
                            <div>
                              <span className="text-xs text-emerald-600 dark:text-emerald-400">{t("colLatency")}</span>
                              <p className="font-mono font-semibold text-emerald-800 dark:text-emerald-200">{benchmarkResult[key.id]!.latencyMs}ms</p>
                            </div>
                            <div>
                              <span className="text-xs text-emerald-600 dark:text-emerald-400">{t("colTps")}</span>
                              <p className="font-mono font-semibold text-emerald-800 dark:text-emerald-200">{benchmarkResult[key.id]!.tokensPerSecond} tok/s</p>
                            </div>
                            <div>
                              <span className="text-xs text-emerald-600 dark:text-emerald-400">{t("colTtft")}</span>
                              <p className="font-mono font-semibold text-emerald-800 dark:text-emerald-200">{benchmarkResult[key.id]!.ttftMs}ms</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-red-700 dark:text-red-300">{benchmarkResult[key.id]!.error}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
