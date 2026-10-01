"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useState } from "react";
import { useStudioPreferences } from "./preferences";

const Scene = dynamic(() => import("./scene"), { ssr: false });

class RenderBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export function SceneBoundary() {
  const { ready, reduced, dark } = useStudioPreferences();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let intersects = true;
    const update = () => setVisible(intersects && !document.hidden);
    document.addEventListener("visibilitychange", update);
    const stage = document.getElementById("studio-stage");
    const observer = new IntersectionObserver(([entry]) => { intersects = entry.isIntersecting; update(); });
    if (stage) observer.observe(stage);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  // The dynamic import and texture requests never start for reduced motion/save-data.
  if (!ready || reduced) return null;
  return <RenderBoundary><Scene dark={dark} visible={visible} /></RenderBoundary>;
}
