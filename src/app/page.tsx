// Milestone 0 foundation page. It proves fonts, tokens and accessibility checks work.
// It is not a product screen; the homepage (The Lifted Ink) arrives in Milestone 3.
export default function FoundationPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[var(--content-max)] flex-col justify-center gap-6 px-4 py-30 md:px-8">
      <p className="text-label font-bold tracking-[0.14em] text-text-secondary uppercase">
        Project foundation
      </p>
      <h1 className="font-display text-display-2 leading-none font-light italic md:text-display-1">
        The Unsaid
      </h1>
      <p className="font-display text-display-5 text-accent italic">
        Some stories are written. Others are confessed.
      </p>
      <p className="max-w-[var(--measure)] font-reading text-reading-compact leading-relaxed text-text-body">
        This build contains the foundations only. The Whisper Wall and the Library are not built
        yet.
      </p>
    </main>
  );
}
