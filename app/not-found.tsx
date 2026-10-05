import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { SimpleToolbar } from "@/components/resume/SimpleToolbar";
import { SimpleFooter } from "@/components/resume/SimpleFooter";
import "./studio.css";
import "./simple.css";

export default function NotFound() {
  return (
    <div className="portfolio-studio rs rs-404">
      <SimpleToolbar back={{ href: "/", label: "Portfolio" }} />
      <main className="rs-sheet">
        <header className="rs-head">
          <div className="rs-letterhead">
            <span className="rs-monogram" aria-hidden="true">KV</span>
            <span>Error 404</span>
            <span className="rs-letterhead-date">Page not found</span>
          </div>
          <div className="rs-head-main">
            <p className="rs-case-kicker">404</p>
            <h1 className="rs-404-title">This page isn&apos;t on the résumé.</h1>
            <p className="rs-case-lead">The link may be old, or the page may have moved. Everything I&apos;ve built is still a click away.</p>
            <p className="rs-case-actions">
              <Link className="rs-btn rs-btn-primary" href="/resume">Read the résumé <LuArrowRight aria-hidden="true" /></Link>
              <Link className="rs-btn" href="/resume#projects">Browse projects</Link>
            </p>
          </div>
        </header>
        <SimpleFooter />
      </main>
    </div>
  );
}
