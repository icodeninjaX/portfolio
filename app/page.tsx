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
    { scene: "hero", label: "Boot" },
    { scene: "silicon", label: "L1 · Silicon" },
    { scene: "signal", label: "L2 · Signal" },
    { scene: "data", label: "L3 · Data" },
    ...projects.map((p) => ({ scene: p.slug, label: `L4 · ${p.name.split(" ")[0]}` })),
    { scene: "now", label: "L5 · Now" },
    { scene: "contact", label: "Contact" },
  ];

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
