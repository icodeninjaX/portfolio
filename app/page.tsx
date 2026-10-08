import { resumeData } from "@/lib/data";
import { StackExperience, type StackStage } from "@/components/stack/StackExperience";
import {
  ContactSection,
  DataSection,
  HeroSection,
  NowSection,
  ProjectSection,
  SignalSection,
  SiliconSection,
} from "@/components/stack/Sections";

export default function Home() {
  const { projects } = resumeData;
  // One entry per `data-stage` section below, in order. Scene ids match
  // components/stack/sceneManifest.ts; projects use their slug.
  const stages: StackStage[] = [
    { scene: "hero", label: "Opening" },
    { scene: "silicon", label: "Workbench" },
    { scene: "signal", label: "LPG counter" },
    { scene: "data", label: "Whiteboard" },
    ...projects.map((p) => ({ scene: p.slug, label: p.name.split(" ")[0] })),
    { scene: "now", label: "Now" },
    { scene: "contact", label: "Next scene" },
  ].map((s, i) => ({ ...s, label: `Sc ${String(i).padStart(2, "0")} · ${s.label}` }));

  return (
    <StackExperience stages={stages}>
      <a href="#work" className="skip-link">
        Skip to work
      </a>
      <main id="main-content">
        <HeroSection data={resumeData} />
        <SiliconSection data={resumeData} />
        <SignalSection data={resumeData} />
        <DataSection data={resumeData} />
        {projects.map((p, i) => (
          <ProjectSection key={p.slug} project={p} index={i} total={projects.length} />
        ))}
        <NowSection data={resumeData} />
        <ContactSection data={resumeData} />
      </main>
    </StackExperience>
  );
}
