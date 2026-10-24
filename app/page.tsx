import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Reviews } from "@/components/Reviews";
import { FAQ } from "@/components/FAQ";
import { LeadForm } from "@/components/LeadForm";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Reviews />
        <FAQ />
        <LeadForm />
      </main>
      <Footer />
      <AiAssistant />
    </>
  );
}
