// Component tests run in jsdom. Unmount everything rendered by a test before the next one starts.
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
