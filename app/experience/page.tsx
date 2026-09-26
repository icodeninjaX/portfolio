import { resumeData } from "@/lib/data";
import { JourneyExperience } from "@/components/journey/JourneyExperience";
import { LedgerSection, SummitSection, TrailheadSection, WaypointSection } from "@/components/journey/Sections";

export const metadata = {
  title: "Journey | Keith Vergara",
  description:
    "Keith Vergara's route from a vocational hardware bench in 2014 to full-stack web development: every milestone, role and tool picked up along the way.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  const { journey } = resumeData;
  return (
    <JourneyExperience>
      <a href="#wp-01" className="skip-link">
        Skip to content
      </a>
      <main id="main-content">
        <TrailheadSection data={resumeData} />
        {journey.map((item, i) => (
          <WaypointSection key={item.title} item={item} index={i} total={journey.length} />
        ))}
        <LedgerSection data={resumeData} />
        <SummitSection data={resumeData} />
      </main>
    </JourneyExperience>
  );
}
