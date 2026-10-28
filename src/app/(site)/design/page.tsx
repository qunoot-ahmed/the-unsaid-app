import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MOOD_IDS, MoodLabel, MoodRule } from "@/modules/confessions";
import {
  Button,
  EmptyState,
  ErrorNotice,
  Skeleton,
  SmallCaps,
  StatusLine,
  TextArea,
  TextField,
} from "@/shared/ui";
import { DialogSpecimen, RadioSpecimen } from "./_components/interactive-specimens";

export const metadata: Metadata = { title: "Design system", robots: { index: false } };

const SEMANTIC = [
  ["ground", "bg-ground"],
  ["surface", "bg-surface"],
  ["sheet", "bg-sheet"],
  ["rule", "bg-rule"],
  ["control-border", "bg-control-border"],
  ["text", "bg-text"],
  ["text-secondary", "bg-text-secondary"],
  ["text-body", "bg-text-body"],
  ["accent", "bg-accent"],
  ["link", "bg-link"],
  ["danger", "bg-danger"],
  ["success", "bg-success"],
] as const;

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-6 border-t border-rule py-12">
      <h2 id={id} className="m-0 font-display text-display-4 font-normal italic">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DesignSpecimenPage() {
  return (
    <main id="main" className="mx-auto max-w-[var(--content-max)] px-4 pt-12 pb-24 md:px-8">
      <SmallCaps className="text-accent">Nocturne Folio</SmallCaps>
      <h1 className="mt-3 mb-4 font-display text-[clamp(2.5rem,6vw,3.5rem)] leading-none font-light italic">
        Design system
      </h1>
      <p className="m-0 mb-10 max-w-[60ch] font-reading text-reading-compact text-text-body">
        Tokens and components from DESIGN.md, rendered from the same code the application uses.
      </p>

      <Section id="colour" title="Colour">
        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-6">
          {SEMANTIC.map(([name, swatch]) => (
            <li key={name} className="flex flex-col gap-2">
              <span className={`block h-16 border border-control-border ${swatch}`} />
              <span className="text-help text-text-body">{name}</span>
            </li>
          ))}
        </ul>
        <ul className="m-0 flex list-none flex-wrap gap-x-7 gap-y-3 p-0">
          {MOOD_IDS.map((mood) => (
            <li key={mood} className="inline-flex items-center gap-2.5">
              <MoodRule mood={mood} />
              <MoodLabel mood={mood} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="type" title="Typography">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <SmallCaps className="text-text-secondary">Display · Newsreader</SmallCaps>
            <p className="m-0 font-display text-display-2 leading-none font-light italic">Unsaid</p>
            <p className="m-0 font-display text-display-4">Section and choice prompt</p>
          </div>
          <div className="flex flex-col gap-3">
            <SmallCaps className="text-text-secondary">Reading · Literata</SmallCaps>
            <p className="m-0 font-reading text-reading leading-[1.7] text-text-body">
              She carried it into the kitchen and set it on the table between the salt cellar and
              the unpaid gas bill.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <SmallCaps className="text-text-secondary">
              Interface · Atkinson Hyperlegible Next
            </SmallCaps>
            <p className="m-0 text-ui font-bold">Button and navigation 15 px</p>
            <p className="m-0 text-help">Help and controls 14 px</p>
            <SmallCaps>Small caps label 12 px</SmallCaps>
          </div>
        </div>
      </Section>

      <Section id="buttons" title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="text">Text button</Button>
          <Button disabled>Disabled</Button>
          <Button pending pendingLabel="Releasing">
            Release it
          </Button>
        </div>
      </Section>

      <Section id="fields" title="Fields and choices">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <TextField
              id="specimen-pen"
              label="Pen name"
              help="3 to 24 letters, numbers or spaces."
              defaultValue="Wren Hollis"
            />
            <TextField
              id="specimen-error"
              label="Email"
              defaultValue="reader.example.com"
              error="Enter the email address you joined with, for example name@example.com."
            />
            <TextArea
              id="specimen-letter"
              label="Your letter"
              rows={3}
              defaultValue="I never told her I was the one who called."
            />
          </div>
          <RadioSpecimen />
        </div>
      </Section>

      <Section id="feedback" title="Feedback and states">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <StatusLine>Kept in your drafts · just now</StatusLine>
            <ErrorNotice title="We could not release your letter.">
              It is still here, exactly as you left it. Nothing was published.
            </ErrorNotice>
            <Skeleton label="Loading letters" />
          </div>
          <EmptyState title="Nothing in this room yet.">
            Be the first to leave something here. It will carry no name.
          </EmptyState>
        </div>
      </Section>

      <Section id="dialog" title="Dialog">
        <p className="m-0 max-w-[60ch] text-help text-text-secondary">
          Focus starts on the least destructive action, stays inside while open, Escape closes, and
          focus returns to the button that opened it.
        </p>
        <DialogSpecimen />
      </Section>
    </main>
  );
}
