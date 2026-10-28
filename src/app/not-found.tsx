import { ButtonLink, SmallCaps } from "@/shared/ui";

// Used for missing, hidden and deleted content alike, so a response never reveals whether
// something existed (DESIGN.md, interaction rules).
export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-[var(--content-max)] flex-col justify-center gap-6 px-4 py-24 md:px-8"
    >
      <SmallCaps className="text-text-secondary">Not found</SmallCaps>
      <h1 className="m-0 max-w-[18ch] font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.05] font-light italic">
        This page was never written.
      </h1>
      <p className="m-0 max-w-[52ch] font-reading text-reading-compact leading-relaxed text-text-body">
        It may have been deleted, hidden while it is reviewed, or the link may be wrong.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Go to the beginning</ButtonLink>
        <ButtonLink href="/wall" variant="secondary">
          Read the Wall
        </ButtonLink>
      </div>
    </main>
  );
}
