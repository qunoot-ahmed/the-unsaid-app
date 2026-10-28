import type { Metadata } from "next";
import { getDemoWall, parseMoodParam, WallView } from "@/modules/confessions";

export const metadata: Metadata = { title: "The Whisper Wall" };

export default async function WallPage({ searchParams }: PageProps<"/wall">) {
  const { mood: moodParam } = await searchParams;
  const mood = parseMoodParam(moodParam);
  return <WallView mood={mood} letters={getDemoWall(mood)} />;
}
