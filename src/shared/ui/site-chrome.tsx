import Link from "next/link";
import { SiteNav, type NavItem } from "./site-nav";

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { href: "/wall", label: "The Wall" },
  { href: "/stories/the-letter-at-number-nine/read", label: "Read a story" },
  { href: "/write", label: "Write" },
];

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-50 bg-text px-4 py-3 font-bold text-ground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
    >
      Skip to content
    </a>
  );
}

export function Wordmark() {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 items-center font-display text-[1.625rem] text-text italic no-underline"
    >
      The Unsaid
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="relative border-b border-rule">
      <div className="mx-auto flex max-w-[var(--content-max)] items-center justify-between gap-6 px-4 py-4 md:px-8 md:py-6">
        <Wordmark />
        <SiteNav items={NAV_ITEMS} />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-[var(--content-max)] flex-col gap-6 px-4 py-12 md:flex-row md:justify-between md:px-8">
        <div className="flex flex-col gap-2">
          <span className="font-display text-[1.375rem] italic">The Unsaid</span>
          <span className="text-help text-text-secondary">
            An independent, open-source project. This preview uses fictional content only.
          </span>
        </div>
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-help md:flex-row md:gap-7">
          <li>
            <Link href="/design" className="inline-flex min-h-11 items-center text-link">
              Design system
            </Link>
          </li>
          <li>
            <a
              href="https://github.com/qunoot-ahmed/the-unsaid-app"
              className="inline-flex min-h-11 items-center text-link"
            >
              Source code
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
