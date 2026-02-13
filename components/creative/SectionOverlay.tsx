"use client";

import { resumeData } from "@/lib/data";

const SECTION_COLORS: Record<string, string> = {
  summary: "#2563eb",
  projects: "#d946ef",
  experience: "#16a34a",
  skills: "#ea580c",
  education: "#7c3aed",
};

function SummaryContent() {
  return (
    <div>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151" }}>
        {resumeData.summary}
      </p>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 12, color: "#6b7280" }}>{resumeData.location}</span>
        <span style={{ fontSize: 12, color: "#6b7280" }}>{resumeData.email}</span>
        {resumeData.github && (
          <span style={{ fontSize: 12, color: "#6b7280" }}>{resumeData.github}</span>
        )}
      </div>
    </div>
  );
}

function ProjectsContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {resumeData.projects.map((p) => (
        <div key={p.name}>
          <h4 style={{ fontSize: 14, color: "#1f2937", fontWeight: 600, marginBottom: 4 }}>{p.name}</h4>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "#4b5563", marginBottom: 6 }}>
            {p.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {p.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 3,
                  background: "#f3e8ff",
                  color: "#7c3aed",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {resumeData.experience.map((exp) => (
        <div key={exp.company}>
          <h4 style={{ fontSize: 14, color: "#1f2937", fontWeight: 600, marginBottom: 2 }}>
            {exp.role}
          </h4>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
            {exp.company} &bull; {exp.startDate} – {exp.endDate}
          </p>
          <ul style={{ margin: 0, paddingLeft: 16, listStyleType: "disc" }}>
            {exp.highlights.map((h, i) => (
              <li key={i} style={{ fontSize: 12, lineHeight: 1.6, color: "#4b5563", marginBottom: 4 }}>
                {h}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SkillsContent() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {resumeData.skills.map((skill) => (
        <div
          key={skill.name}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            fontSize: 12,
            color: "#9a3412",
          }}
        >
          {skill.name}
          <span style={{ marginLeft: 6, opacity: 0.5 }}>
            {"★".repeat(skill.level)}{"☆".repeat(5 - skill.level)}
          </span>
        </div>
      ))}
    </div>
  );
}

function EducationContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {resumeData.education.map((edu) => (
        <div key={edu.institution}>
          <h4 style={{ fontSize: 14, color: "#1f2937", fontWeight: 600, marginBottom: 4 }}>
            {edu.degree}
          </h4>
          <p style={{ fontSize: 12, color: "#4b5563", marginBottom: 2 }}>
            {edu.institution}
          </p>
          <p style={{ fontSize: 12, color: "#6b7280" }}>
            {edu.location}
          </p>
        </div>
      ))}
    </div>
  );
}

const SECTION_RENDERERS: Record<string, () => React.ReactNode> = {
  summary: () => <SummaryContent />,
  projects: () => <ProjectsContent />,
  experience: () => <ExperienceContent />,
  skills: () => <SkillsContent />,
  education: () => <EducationContent />,
};

const SECTION_LABELS: Record<string, string> = {
  summary: "Summary",
  projects: "Projects",
  experience: "Experience",
  skills: "Skills",
  education: "Education",
};

interface SectionOverlayProps {
  activeSection: string | null;
}

export function SectionOverlay({ activeSection }: SectionOverlayProps) {
  if (!activeSection) return null;

  const color = SECTION_COLORS[activeSection] || "#2563eb";
  const renderer = SECTION_RENDERERS[activeSection];
  const label = SECTION_LABELS[activeSection];

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        right: 24,
        width: 340,
        maxHeight: "calc(100vh - 140px)",
        overflowY: "auto",
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 24,
        fontFamily: "system-ui, -apple-system, sans-serif",
        zIndex: 15,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <h3
        style={{
          fontSize: 16,
          color,
          marginBottom: 16,
          paddingBottom: 8,
          borderBottom: `2px solid ${color}`,
          letterSpacing: 1,
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        {label}
      </h3>
      {renderer?.()}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
