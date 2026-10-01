import { resumeData } from "@/lib/data";
import { StackExperience } from "@/components/stack/StackExperience";
import {
  ContactSection,
  DataSection,
  HeroSection,
  NowSection,
  ProjectSection,
  SignalSection,
  SiliconSection,
} from "@/components/stack/Sections";

// Projects without product screenshots get a generated editorial cover.
const COVERS: Record<string, string> = {
  "new-z1on-lpg": "/stack/cover-lpg.webp",
  plantpal: "/stack/cover-plantpal.webp",
};

export default function Home() {
  const { projects } = resumeData;
  const panels = projects.map((p) => ({
    slug: p.slug,
    images: p.images.length ? p.images.map((i) => i.src) : [COVERS[p.slug]].filter(Boolean),
  }));

  return (
    <StackExperience projects={panels}>
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
