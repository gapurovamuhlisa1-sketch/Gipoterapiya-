import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <Hero />
          <Journey />
          <LeadForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
