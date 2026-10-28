import type { Metadata } from "next";
import { getDemoReaderStart, Reader } from "@/modules/reading";

export const metadata: Metadata = { title: "The Letter at Number Nine" };

export default function DemoReaderPage() {
  return <Reader initialView={getDemoReaderStart()} />;
}
