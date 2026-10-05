import { resumeData } from "@/lib/data";

// Signature footer that closes every Simple-mode sheet.
export function SimpleFooter() {
  return (
    <footer className="rs-foot">
      <div>
        <p className="rs-signature">{resumeData.name}</p>
        <p>Open to full-stack roles · References available on request</p>
      </div>
      <p><a href={`mailto:${resumeData.email}`}>{resumeData.email}</a><br />{resumeData.location}</p>
    </footer>
  );
}
