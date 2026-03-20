import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ModelsSection from "@/components/ModelsSection";
import ComingSoonSection from "@/components/ComingSoonSection";
import Footer from "@/components/Footer";

export default async function Home() {
  const session = await auth0.getSession();

  const publishedModels = await prisma.aIModel.findMany({
    where: { isPublished: true },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const userModels = publishedModels.map((m) => ({
    id: m.id,
    name: m.name,
    provider: m.provider,
    description: m.description,
    contextWindow: m.contextWindow,
    inputPrice: m.inputPrice,
    outputPrice: m.outputPrice,
    tags: m.tags,
    freeTokens: m.freeTokens,
  }));

  return (
    <>
      <Navbar user={session?.user ?? null} />
      <main className="flex-1">
        <HeroSection />
        <ModelsSection additionalModels={userModels} />
        <ComingSoonSection />
      </main>
      <Footer />
    </>
  );
}
