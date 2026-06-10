import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustedBy } from "./components/TrustedBy";
import { Modules } from "./components/Modules";
import { WhyChoose } from "./components/WhyChoose";
import { Industries } from "./components/Industries";
import { ProductShowcase } from "./components/ProductShowcase";
import { Benefits } from "./components/Benefits";
import { Testimonials } from "./components/Testimonials";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { DemoModal } from "./components/DemoModal";

export function MarketingSite() {
  const [darkMode, setDarkMode] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; mode: "started" | "demo" }>({
    open: false,
    mode: "demo",
  });

  const openDemo = () => setModal({ open: true, mode: "demo" });
  const openStarted = () => setModal({ open: true, mode: "started" });
  const closeModal = () => setModal((m) => ({ ...m, open: false }));

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} onBookDemo={openDemo} />
        <main>
          <Hero onGetStarted={openStarted} />
          <TrustedBy />
          <Modules />
          <WhyChoose />
          <Industries />
          <ProductShowcase />
          <Benefits />
          <Testimonials />
          <CTA onScheduleDemo={openDemo} />
        </main>
        <Footer />
        <DemoModal open={modal.open} onClose={closeModal} mode={modal.mode} />
      </div>
    </div>
  );
}
