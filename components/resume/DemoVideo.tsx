"use client";

import { useEffect, useRef, useState } from "react";
import { LuVolume2, LuVolumeX } from "react-icons/lu";

// Case-study demo video: muted, looping and inline like a motion graphic, but
// it only autoplays when the visitor hasn't asked for reduced motion. The
// videos carry a voice-over and music, so a "Play with sound" button restarts the video
// from the top with sound on (browsers never autoplay with sound).
export function DemoVideo({ mp4, webm, poster, label }: { mp4: string; webm?: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (!video.muted) return; // someone is listening; leave playback alone
      if (motion.matches) video.pause();
      else video.play().catch(() => {});
    };
    const onVolume = () => setMuted(video.muted);
    sync();
    motion.addEventListener("change", sync);
    video.addEventListener("volumechange", onVolume);
    return () => {
      motion.removeEventListener("change", sync);
      video.removeEventListener("volumechange", onVolume);
    };
  }, []);

  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    if (video.muted) {
      video.muted = false;
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.muted = true;
    }
  };

  return (
    <div className="rs-demo-frame">
      <video ref={ref} className="rs-demo-video" poster={poster} muted loop playsInline controls preload="metadata" aria-label={label}>
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </video>
      <button type="button" className="rs-demo-sound" onClick={toggleSound} aria-pressed={!muted}>
        {muted ? <LuVolume2 aria-hidden="true" /> : <LuVolumeX aria-hidden="true" />}
        {muted ? "Play with sound" : "Mute"}
      </button>
    </div>
  );
}
