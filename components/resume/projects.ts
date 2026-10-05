import { resumeData } from "@/lib/data";

// Shared by the resume's project list and the case study pages, so the
// numbering ("03 — Personal") and previous/next order always agree.

export type Project = (typeof resumeData.projects)[number];

const PROJECT_KIND = { current: "Work", internship: "Internship", personal: "Personal" } as const;

export function projectKind(p: Project): string {
  return "kind" in p && p.kind ? p.kind : PROJECT_KIND[p.status];
}

// Employer work first (job, then internship), then own projects in data order.
const RANK: Record<string, number> = { Work: 0, Internship: 1 };
export const orderedProjects = [...resumeData.projects].sort((a, b) => (RANK[projectKind(a)] ?? 2) - (RANK[projectKind(b)] ?? 2));

export const projectNumber = (i: number) => String(i + 1).padStart(2, "0");
