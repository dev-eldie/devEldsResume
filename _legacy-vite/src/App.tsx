import { CodeRainBackground } from "@/components/portfolio/CodeRainBackground";
import { Cursor } from "@/components/portfolio/Cursor";
import { Nav } from "@/components/portfolio/Nav";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { LazySection } from "@/components/portfolio/LazySection";

export default function App() {
  return (
    <div className="relative min-h-screen text-fg overflow-x-hidden">
      <CodeRainBackground />
      <Cursor />
      <Nav />

      <main className="relative">
        <HeroSection />

        <LazySection
          loader={() =>
            import("@/components/portfolio/AboutSection").then((m) => ({
              default: m.AboutSection,
            }))
          }
        />

        <LazySection
          loader={() =>
            import("@/components/portfolio/SkillsSection").then((m) => ({
              default: m.SkillsSection,
            }))
          }
        />

        <LazySection
          loader={() =>
            import("@/components/portfolio/ExperienceSection").then((m) => ({
              default: m.ExperienceSection,
            }))
          }
        />

        <LazySection
          loader={() =>
            import("@/components/portfolio/EducationSection").then((m) => ({
              default: m.EducationSection,
            }))
          }
        />

        <LazySection
          loader={() =>
            import("@/components/portfolio/PortfolioUploadSection").then((m) => ({
              default: m.PortfolioUploadSection,
            }))
          }
        />

        <LazySection
          loader={() =>
            import("@/components/portfolio/ContactSection").then((m) => ({
              default: m.ContactSection,
            }))
          }
        />

        <LazySection
          loader={() =>
            import("@/components/portfolio/Footer").then((m) => ({
              default: m.Footer,
            }))
          }
        />
      </main>
    </div>
  );
}
