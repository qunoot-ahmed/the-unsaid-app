"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { cn } from "./cn";

export interface NavItem {
  href: string;
  label: string;
}

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

// Primary navigation: an inline list from the md breakpoint, a disclosure menu below it.
export function SiteNav({ items }: { items: ReadonlyArray<NavItem> }) {
  const pathname = usePathname();
  // The menu remembers the page it was opened on, so navigating anywhere closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const menuId = useId();

  const links = items.map((item) => {
    const current = isCurrent(pathname, item.href);
    return (
      <li key={item.href}>
        <Link
          href={item.href as never}
          aria-current={current ? "page" : undefined}
          className={cn(
            "inline-flex min-h-11 items-center border-b border-transparent text-ui text-text no-underline hover:border-accent",
            current && "border-accent",
          )}
        >
          {item.label}
        </Link>
      </li>
    );
  });

  return (
    <nav aria-label="Primary">
      <ul className="m-0 hidden list-none gap-9 p-0 md:flex">{links}</ul>
      <div className="md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpenOn(open ? null : pathname)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 border border-control-border px-3 text-ui text-text"
        >
          <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
            <path d="M0 1h18M0 6h18M0 11h12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Menu
        </button>
        <ul
          id={menuId}
          hidden={!open}
          className="absolute inset-x-0 top-full z-20 m-0 flex list-none flex-col gap-1 border-b border-rule bg-ground px-4 pt-2 pb-6"
        >
          {links}
        </ul>
      </div>
    </nav>
  );
}
