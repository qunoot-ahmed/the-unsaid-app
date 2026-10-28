import { buildReaderView, type ReaderView } from "../domain/reader-view";
import { DEMO_STORY } from "./demo-story";

/** Initial view for the demonstration reader page, rendered on the server. */
export function getDemoReaderStart(): ReaderView {
  const view = buildReaderView(DEMO_STORY, [], []);
  if (!view) throw new Error("The demonstration story has no valid start scene.");
  return view;
}
