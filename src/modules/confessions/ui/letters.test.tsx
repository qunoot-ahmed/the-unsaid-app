import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FoldedLetter } from "./folded-letter";
import { SealedLetter } from "./sealed-letter";

const reveal = vi.hoisted(() => vi.fn());
vi.mock("../server/demo-actions", () => ({ revealSealedLetter: reveal }));

beforeEach(() => {
  reveal.mockReset();
});

describe("[CONF-FOLD-001] folded letter", () => {
  it("keeps the remainder out of the page until it is unfolded", async () => {
    render(
      <FoldedLetter visible="The visible part." remainder="The hidden remainder." minutes={2} />,
    );
    const button = screen.getByRole("button", { name: "Unfold the rest · 2 min" });

    expect(screen.queryByText("The hidden remainder.")).toBeNull();
    expect(button.getAttribute("aria-expanded")).toBe("false");

    await userEvent.click(button);
    expect(screen.getByText("The hidden remainder.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Fold it back" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });
});

describe("[CONF-SEAL-003] sealed letter", () => {
  it("shows only the content note until the reader breaks the seal", async () => {
    let resolve: (value: unknown) => void = () => {};
    reveal.mockReturnValue(new Promise((done) => (resolve = done)));
    render(<SealedLetter id="p7r2w8vd" contentNote="Grief and loss" />);

    expect(screen.getByText("Sealed by the writer · Grief and loss")).toBeTruthy();
    expect(screen.queryByText(/voicemail/)).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Break the seal" }));
    expect(reveal).toHaveBeenCalledWith("p7r2w8vd");
    expect(screen.getByRole("button", { name: "Opening" })).toHaveProperty("disabled", true);
    expect(screen.getByRole("status").textContent).toBe("Opening the letter");

    resolve({ ok: true, body: "She left a voicemail about a recipe." });
    expect(await screen.findByText("She left a voicemail about a recipe.")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Letter opened");
  });

  it("forgets the text when folded away again", async () => {
    reveal.mockResolvedValue({ ok: true, body: "She left a voicemail about a recipe." });
    render(<SealedLetter id="p7r2w8vd" contentNote="Grief and loss" />);
    await userEvent.click(screen.getByRole("button", { name: "Break the seal" }));
    await screen.findByText("She left a voicemail about a recipe.");

    await userEvent.click(screen.getByRole("button", { name: "Fold it away again" }));
    expect(screen.queryByText("She left a voicemail about a recipe.")).toBeNull();
    expect(screen.getByRole("button", { name: "Break the seal" })).toBeTruthy();
  });

  it("announces a failure and lets the reader try again", async () => {
    reveal.mockResolvedValue({ ok: false, message: "This letter could not be opened. Try again." });
    render(<SealedLetter id="p7r2w8vd" contentNote="Grief and loss" />);

    await userEvent.click(screen.getByRole("button", { name: "Break the seal" }));

    expect((await screen.findByRole("alert")).textContent).toBe(
      "This letter could not be opened. Try again.",
    );
    expect(screen.getByRole("button", { name: "Break the seal" })).toHaveProperty(
      "disabled",
      false,
    );
  });
});
