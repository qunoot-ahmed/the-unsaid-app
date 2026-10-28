import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/shared/ui";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
