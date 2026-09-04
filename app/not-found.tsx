import Link from "next/link";
import { PageBackground } from "@/components/page-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { LuArrowLeft } from "react-icons/lu";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <PageBackground />
      <ThemeToggle />
      <main className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 text-center sm:px-8">
        <div className="section-box flex max-w-md flex-col items-center p-8 sm:p-10">
          <span className="font-display text-xs font-semibold uppercase tracking-wider text-muted-light">
            404 Error
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Page Not Found
          </h1>
          <p className="mt-3 font-display text-sm leading-relaxed text-muted">
            Sorry, the page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-border-hover bg-card px-4 py-2 font-display text-xs font-medium text-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <LuArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
