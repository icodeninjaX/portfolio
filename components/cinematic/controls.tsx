"use client";

import { savePreference, useStudioPreferences } from "./preferences";
import Link from "next/link";
import type React from "react";

export function SkipLink() {
  return <Link href="#main-content" className="skip-link" onClick={() => {
    requestAnimationFrame(() => document.getElementById("main-content")?.focus({ preventScroll: true }));
  }}>Skip to main content</Link>;
}

export function StudioControls() {
  const { reduced, dark } = useStudioPreferences();
  return <div className="studio-controls">
    <button type="button" aria-pressed={reduced} onClick={() => savePreference("reduced-effects", String(!reduced))} title="System reduced-motion and data-saving preferences also apply">
      <span className="effects-dot" aria-hidden="true" /> Reduced effects
    </button>
    <button type="button" className="studio-theme" onClick={() => savePreference("theme", dark ? "light" : "dark")} aria-label={`Switch to ${dark ? "light" : "dark"} theme`}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/></svg>
    </button>
  </div>;
}

export function PrintButton({ label = "Print / Save as PDF ↗" }: { label?: React.ReactNode }) {
  return <button className="studio-button print-hidden" onClick={() => window.print()}>{label}</button>;
}
