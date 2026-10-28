import Link from "next/link";
import { cn } from "@/shared/ui";
import { MOOD_IDS, MOODS, type MoodId } from "../domain/moods";
import { MoodRule } from "./mood-mark";

function roomHref(mood: MoodId | null) {
  return mood ? `/wall?mood=${mood}` : "/wall";
}

/**
 * Mood rooms are links, so a room can be shared and the back button works.
 * Vertical list in the margin from md, a scrolling row on small screens.
 */
export function MoodRooms({ current }: { current: MoodId | null }) {
  const rooms: Array<{ id: MoodId | null; label: string }> = [
    { id: null, label: "All rooms" },
    ...MOOD_IDS.map((id) => ({ id, label: MOODS[id].label })),
  ];
  return (
    <nav aria-label="Mood rooms">
      <ul className="m-0 flex list-none gap-4 overflow-x-auto p-0 pb-1 md:flex-col md:gap-0 md:overflow-visible">
        {rooms.map((room) => {
          const isCurrent = room.id === current;
          return (
            <li key={room.label} className="shrink-0">
              <Link
                href={roomHref(room.id) as never}
                aria-current={isCurrent ? "page" : undefined}
                scroll={false}
                className={cn(
                  "inline-flex min-h-11 items-center gap-3 border-b-2 border-transparent text-ui no-underline md:border-b-0",
                  isCurrent
                    ? "border-accent font-bold text-accent"
                    : "text-text-body hover:text-text",
                )}
              >
                {room.id ? (
                  <MoodRule mood={room.id} size="small" />
                ) : (
                  <span aria-hidden="true" className="inline-block h-0.5 w-3 bg-accent" />
                )}
                {room.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
