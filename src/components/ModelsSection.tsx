import { useTranslations } from "next-intl";
import { models as sampleModels, type Model } from "@/data/models";
import ModelCard from "./ModelCard";

interface ModelsSectionProps {
  additionalModels?: Model[];
}

export default function ModelsSection({ additionalModels = [] }: ModelsSectionProps) {
  const t = useTranslations("models");
  const allModels = [...additionalModels, ...sampleModels];

  return (
    <section id="models" className="py-20 sm:py-28 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
            {t("sectionTitle")}
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {t("sectionSubtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>
    </section>
  );
}
