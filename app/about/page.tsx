import { resumeData } from "@/lib/data";
import { AboutExperience } from "@/components/about/AboutExperience";
import {
  CoreSection,
  DriveSection,
  OffHoursSection,
  OrbitSection,
  OriginSection,
  SurfaceSection,
  TrajectorySection,
} from "@/components/about/Sections";

export const metadata = {
  title: "About | Keith Vergara",
  description:
    "Keith Vergara, full-stack web developer from Las Piñas City: where I started, what I do off-hours, what drives me, and where I'm headed.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <AboutExperience>
      <a href="#origin" className="skip-link">
        Skip to content
      </a>
      <main id="main-content">
        <SurfaceSection data={resumeData} />
        <OriginSection data={resumeData} />
        <OrbitSection data={resumeData} />
        <OffHoursSection data={resumeData} />
        <DriveSection data={resumeData} />
        <TrajectorySection data={resumeData} />
        <CoreSection data={resumeData} />
      </main>
    </AboutExperience>
  );
}
