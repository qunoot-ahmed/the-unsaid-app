import type { Metadata } from "next";
import { Composer } from "@/modules/confessions";

export const metadata: Metadata = { title: "Write a letter" };

export default function WritePage() {
  return (
    <main id="main">
      <Composer />
    </main>
  );
}
