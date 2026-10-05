"use client";

import { useEffect, useRef } from "react";

// Case-study demo video: muted, looping and inline like a motion graphic, but
// it only autoplays when the visitor hasn't asked for reduced motion.
export function DemoVideo({ mp4, webm, poster, label }: { mp4: string; webm?: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (motion.matches) video.pause();
      else video.play().catch(() => {});
    };
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  return (
    <video ref={ref} className="rs-demo-video" poster={poster} muted loop playsInline controls preload="metadata" aria-label={label}>
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
