import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LegalPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
