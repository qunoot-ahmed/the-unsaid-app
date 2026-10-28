// Fixed, project-authored homepage content. Never live user content (DESIGN.md, The Lifted Ink).

export interface InkSegment {
  text: string;
  inked: boolean;
}

export const HOMEPAGE_CONFESSION: {
  mood: "regret";
  segments: ReadonlyArray<InkSegment>;
} = {
  mood: "regret",
  segments: [
    { text: "I never told ", inked: false },
    { text: "my brother", inked: true },
    { text: " that I was the one who ", inked: false },
    { text: "sold our father's watch", inked: true },
    { text: ". He still ", inked: false },
    { text: "blames the movers", inked: true },
    { text: ".", inked: false },
  ],
};
