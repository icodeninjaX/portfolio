import Image from "next/image";
import { LuGithub, LuGlobe, LuLinkedin, LuMail, LuMapPin } from "react-icons/lu";
import { resumeData } from "@/lib/data";

const SITE = "portfolio.kdvwebsiteservices.com";
// Stamped at build time; every deploy refreshes it.
const UPDATED = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

function href(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}

function label(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

export function ResumeHeader() {
  const d = resumeData;
  const contacts = [
    { icon: LuMapPin, text: d.location },
    { icon: LuMail, text: d.email, href: `mailto:${d.email}` },
    { icon: LuGlobe, text: SITE, href: `https://${SITE}` },
    { icon: LuGithub, text: label(d.github), href: href(d.github) },
    { icon: LuLinkedin, text: label(d.linkedin).replace("linkedin.com/in/", "in/"), href: href(d.linkedin) },
  ];

  return (
    <header className="rs-head">
      <div className="rs-letterhead">
        <span className="rs-monogram" aria-hidden="true">{d.name.split(" ").map((w) => w[0]).join("")}</span>
        <span>Curriculum vitae</span>
        <span className="rs-letterhead-date">Updated {UPDATED}</span>
      </div>
      <div className="rs-head-main">
        <h1>{d.name}</h1>
        <p className="rs-role">{d.title}<span className="rs-role-dot" aria-hidden="true"> · </span><span className="rs-role-sub">Software & hardware</span></p>
        <p className="rs-headline">{d.resume.headline}</p>
      </div>
      <Image className="rs-photo" src="/profile.webp" width={112} height={112} alt={`Portrait of ${d.name}`} priority />
      <ul className="rs-contact" aria-label="Contact details">
        {contacts.map(({ icon: Icon, text, href: link }) => (
          <li key={text}>
            <Icon aria-hidden="true" />
            {link ? <a href={link} {...(link.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{text}</a> : <span>{text}</span>}
          </li>
        ))}
      </ul>
    </header>
  );
}
