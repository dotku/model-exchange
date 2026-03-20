"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { createModel, updateModel, deleteModel, togglePublish } from "@/app/[locale]/dashboard/actions";
import { formatTokenCount } from "@/lib/format";
import { useRouter } from "next/navigation";

interface ModelData {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: string;
  inputPrice: number;
  outputPrice: number;
  tags: string[];
  freeTokens: number | null;
  speed: string;
  apiDocsUrl: string | null;
  billingType: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardContent({ models }: { models: ModelData[] }) {
  const t = useTranslations("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelData | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createModel(formData);
      setShowForm(false);
      router.refresh();
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editingModel) return;
    startTransition(async () => {
      await updateModel(editingModel.id, formData);
      setEditingModel(null);
      router.refresh();
    });
  }

  function handleDelete(modelId: string) {
    if (!confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      await deleteModel(modelId);
      router.refresh();
    });
  }

  function handleTogglePublish(modelId: string) {
    startTransition(async () => {
      await togglePublish(modelId);
      router.refresh();
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingModel(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {t("addModel")}
        </button>
      </div>

      {/* Model Form Modal */}
      {(showForm || editingModel) && (
        <ModelForm
          model={editingModel}
          onSubmit={editingModel ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingModel(null);
          }}
          isPending={isPending}
        />
      )}

      {/* Models List */}
      {models.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">
            {t("noModels")}
          </h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {t("noModelsDesc")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {models.map((model) => (
            <div
              key={model.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
                      {model.name}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        model.isPublished
                          ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {model.isPublished ? t("published") : t("draft")}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        model.billingType === "platform"
                          ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {model.billingType === "platform" ? t("billingPlatformBadge") : t("billingExternalBadge")}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {model.provider}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-1">
                    {model.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                    <span>
                      {t("input")}: ${model.inputPrice}/1M
                    </span>
                    <span>
                      {t("output")}: ${model.outputPrice}/1M
                    </span>
                    <span>
                      {t("context")}: {model.contextWindow}
                    </span>
                    {model.apiDocsUrl && (
                      <a
                        href={model.apiDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        API Docs
                      </a>
                    )}
                    {model.freeTokens != null && model.freeTokens > 0 && (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                        {t("freeTokens", { count: formatTokenCount(model.freeTokens) })}
                      </span>
                    )}
                    <div className="flex gap-1">
                      {model.tags.map((tag) => (
                        <span key={tag} className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTogglePublish(model.id)}
                    disabled={isPending}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    {model.isPublished ? t("unpublish") : t("publish")}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingModel(model);
                    }}
                    disabled={isPending}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(model.id)}
                    disabled={isPending}
                    className="rounded-lg border border-red-200 dark:border-red-900 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors disabled:opacity-50"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ModelForm({
  model,
  onSubmit,
  onCancel,
  isPending,
}: {
  model: ModelData | null;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const t = useTranslations("dashboard");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">
          {model ? t("editModel") : t("addModel")}
        </h2>

        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {t("modelName")}
            </label>
            <input
              name="name"
              required
              defaultValue={model?.name}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. GPT-4o"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {t("providerName")}
            </label>
            <input
              name="provider"
              required
              defaultValue={model?.provider}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. OpenAI"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {t("description")}
            </label>
            <textarea
              name="description"
              required
              defaultValue={model?.description}
              rows={3}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder={t("descriptionPlaceholder")}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                {t("inputPrice")}
              </label>
              <input
                name="inputPrice"
                type="number"
                step="0.01"
                required
                defaultValue={model?.inputPrice}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="$"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                {t("outputPrice")}
              </label>
              <input
                name="outputPrice"
                type="number"
                step="0.01"
                required
                defaultValue={model?.outputPrice}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="$"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                {t("contextWindow")}
              </label>
              <input
                name="contextWindow"
                required
                defaultValue={model?.contextWindow}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. 128K"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {t("tags")}
            </label>
            <input
              name="tags"
              defaultValue={model?.tags.join(", ")}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder={t("tagsPlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {t("freeTokensLabel")}
            </label>
            <input
              name="freeTokens"
              type="number"
              min="0"
              step="1000"
              defaultValue={model?.freeTokens ?? ""}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder={t("freeTokensPlaceholder")}
            />
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              {t("freeTokensHint")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                {t("speedLabel")}
              </label>
              <select
                name="speed"
                defaultValue={model?.speed ?? "standard"}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="fast">{t("speedFast")}</option>
                <option value="standard">{t("speedStandard")}</option>
                <option value="economy">{t("speedEconomy")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                {t("apiDocsUrlLabel")}
              </label>
              <input
                name="apiDocsUrl"
                type="url"
                defaultValue={model?.apiDocsUrl ?? ""}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="https://docs.example.com/api"
              />
            </div>
          </div>

          {/* Billing Type */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 space-y-3">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("billingTypeLabel")}
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="billingType"
                value="platform"
                defaultChecked={model?.billingType === "platform"}
                className="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {t("billingPlatform")}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t("billingPlatformDesc")}
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="billingType"
                value="external"
                defaultChecked={!model || model.billingType !== "platform"}
                className="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {t("billingExternal")}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t("billingExternalDesc")}
                </p>
              </div>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              name="isPublished"
              type="checkbox"
              defaultChecked={model?.isPublished}
              id="isPublished"
              className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isPublished" className="text-sm text-zinc-700 dark:text-zinc-300">
              {t("publishImmediately")}
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isPending ? t("saving") : model ? t("saveChanges") : t("createModel")}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
