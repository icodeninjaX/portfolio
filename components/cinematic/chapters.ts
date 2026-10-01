export type Vec3 = [number, number, number];
export type ScenePose = {
  camera: Vec3;
  target: Vec3;
  rotation: Vec3;
  spread: number;
  explode: number;
  activeProject: number;
};
export type Chapter = {
  id: string;
  label: string;
  progress: [number, number];
  desktop: ScenePose;
  mobile: ScenePose;
  assets: string[];
  textSafeRegion: { desktop: "left-column"; mobile: "below-stage" };
  fallback: "assembled" | "gallery" | "layers";
};

const pose = (camera: Vec3, rotation: Vec3, spread = 0, explode = 0, activeProject = 0): ScenePose => ({ camera, target: [0, 0, 0], rotation, spread, explode, activeProject });
const define = (id: string, label: string, progress: [number, number], desktop: ScenePose, fallback: Chapter["fallback"]): Chapter => ({
  id, label, progress, desktop,
  mobile: { ...desktop, camera: [desktop.camera[0] * 0.6, desktop.camera[1] + 0.3, desktop.camera[2] + 1] },
  assets: ["/studio/tracky-maindashboard.webp", "/studio/coop-tracker-maindashboard.webp", "/studio/371admin-maindashboard.webp"],
  textSafeRegion: { desktop: "left-column", mobile: "below-stage" }, fallback,
});

// Ranges are chapter-local, normalized against measured document sections.
export const chapters: Chapter[] = [
  define("identity", "01 / Selected work in motion", [0, 1], pose([2.1, 0.7, 10.5], [0.08, -0.22, -0.28]), "assembled"),
  define("projects", "02 / Explore the product", [1, 4], pose([0.3, 0.4, 11], [0.08, 0.35, -0.45], 1), "gallery"),
  define("how-i-build", "03 / Inside the system", [4, 5], pose([3.2, 1.8, 13], [0.18, 0.55, -0.12], 0, 1), "layers"),
  define("experience", "04 / The person behind it", [5, 6], pose([-1.7, 0.8, 11], [-0.06, 0.65, 0.24], 0, 0.25), "assembled"),
  define("contact", "05 / The next chapter", [6, 7], pose([1.2, 0.4, 10.5], [0.08, 0.08, -0.28]), "assembled"),
];

export const sceneStops = [
  { id: "identity", chapter: 0, project: 0 },
  { id: "work-tracky", chapter: 1, project: 0 },
  { id: "work-coop-tracker", chapter: 1, project: 1 },
  { id: "work-371admin", chapter: 1, project: 2 },
  { id: "how-i-build", chapter: 2, project: 0 },
  { id: "experience", chapter: 3, project: 0 },
  { id: "contact", chapter: 4, project: 0 },
] as const;

export function getPose(index: number, mobile: boolean): ScenePose {
  const stop = sceneStops[Math.min(sceneStops.length - 1, Math.max(0, index))];
  const base = chapters[stop.chapter][mobile ? "mobile" : "desktop"];
  return { ...base, activeProject: stop.project,
    rotation: stop.chapter === 1 ? [base.rotation[0], base.rotation[1] + stop.project * 0.18, base.rotation[2] - stop.project * 0.14] : base.rotation,
  };
}
