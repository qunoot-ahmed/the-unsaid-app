import { SmallCaps } from "@/shared/ui";
import { MOODS, type MoodId } from "../domain/moods";

const MOOD_COLOR: Record<MoodId, string> = {
  longing: "bg-mood-longing text-mood-longing",
  regret: "bg-mood-regret text-mood-regret",
  relief: "bg-mood-relief text-mood-relief",
  fear: "bg-mood-fear text-mood-fear",
  tenderness: "bg-mood-tenderness text-mood-tenderness",
  anger: "bg-mood-anger text-mood-anger",
  shame: "bg-mood-shame text-mood-shame",
  hope: "bg-mood-hope text-mood-hope",
};

/** Coloured rule plus the mood name. Colour never carries meaning alone. */
export function MoodRule({ mood, size = "regular" }: { mood: MoodId; size?: "regular" | "small" }) {
  const colour = MOOD_COLOR[mood].split(" ")[0];
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-0.5 shrink-0 ${size === "small" ? "w-3" : "w-6"} ${colour}`}
    />
  );
}

export function MoodLabel({ mood }: { mood: MoodId }) {
  const colour = MOOD_COLOR[mood].split(" ")[1];
  return <SmallCaps className={colour}>{MOODS[mood].label}</SmallCaps>;
}

/** Catalogue mark, mood and day: the archival metadata line above every letter. */
export function LetterMeta({
  catalogueMark,
  mood,
  day,
}: {
  catalogueMark: string;
  mood: MoodId;
  day: string;
}) {
  return (
    <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-text-secondary">
      <SmallCaps className="font-normal">No. {catalogueMark}</SmallCaps>
      <span className="inline-flex items-center gap-3">
        <MoodRule mood={mood} />
        <MoodLabel mood={mood} />
      </span>
      <SmallCaps className="font-normal">{day}</SmallCaps>
    </p>
  );
}
