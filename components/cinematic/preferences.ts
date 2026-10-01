"use client";

import { useSyncExternalStore } from "react";

const event = "studio-preferences";
const sessionOverrides = new Map<string, string>();
function saved(key: string) { if (sessionOverrides.has(key)) return sessionOverrides.get(key)!; try { return localStorage.getItem(key); } catch { return null; } }
function subscribe(callback: () => void) {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const color = matchMedia("(prefers-color-scheme: dark)");
  const connection = (navigator as Navigator & { connection?: EventTarget }).connection;
  window.addEventListener(event, callback);
  const synchronize = () => {
    const theme = saved("theme");
    if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
    callback();
  };
  window.addEventListener("storage", synchronize);
  motion.addEventListener("change", callback);
  color.addEventListener("change", callback);
  connection?.addEventListener("change", callback);
  return () => {
    window.removeEventListener(event, callback);
    window.removeEventListener("storage", synchronize);
    motion.removeEventListener("change", callback);
    color.removeEventListener("change", callback);
    connection?.removeEventListener("change", callback);
  };
}
function snapshot() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const reduced = saved("reduced-effects") === "true" || matchMedia("(prefers-reduced-motion: reduce)").matches || !!connection?.saveData;
  const dark = saved("theme") === "dark" || (!saved("theme") && matchMedia("(prefers-color-scheme: dark)").matches);
  return `${reduced ? "reduced" : "full"}:${dark ? "dark" : "light"}`;
}
export function useStudioPreferences() {
  const value = useSyncExternalStore(subscribe, snapshot, () => "pending:light");
  return { ready: !value.startsWith("pending"), reduced: value.startsWith("reduced"), dark: value.endsWith("dark") };
}
export function savePreference(key: string, value: string) {
  try { localStorage.setItem(key, value); sessionOverrides.delete(key); } catch { sessionOverrides.set(key, value); }
  if (key === "theme") document.documentElement.dataset.theme = value;
  window.dispatchEvent(new Event(event));
}
