import Link from "next/link";
import type { ReactNode } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { StudioControls } from "@/components/cinematic/controls";

// Top bar shared by every Simple-mode page (/resume, case studies, 404).
export function SimpleToolbar({ back, children }: { back: { href: string; label: string }; children?: ReactNode }) {
  return (
    <div className="rs-toolbar print-hidden">
      <Link href={back.href} className="rs-back"><LuArrowLeft aria-hidden="true" /> {back.label}</Link>
      <div className="rs-toolbar-actions"><StudioControls />{children}</div>
    </div>
  );
}
