import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChoiceList } from "./choice-list";
import { EndingsFound } from "./endings-found";
import { Thread } from "./thread";

const CHOICES = [
  { id: "open", label: "Open the letter" },
  { id: "burn", label: "Burn it in the grate" },
  { id: "hale", label: "Take it down to Mr. Hale" },
];

describe("[READ-THREAD-001] choice list", () => {
  it("chooses by button and by number key", async () => {
    const onChoose = vi.fn();
    render(
      <ChoiceList
        prompt="What does Mara do?"
        choices={CHOICES}
        disabled={false}
        onChoose={onChoose}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Burn it in the grate" }));
    fireEvent.keyDown(window, { key: "3" });

    expect(onChoose.mock.calls).toEqual([["burn"], ["hale"]]);
  });

  it("ignores number keys that have no choice, keys typed into fields, and keys while saving", () => {
    const onChoose = vi.fn();
    const { rerender } = render(
      <>
        <input aria-label="Notes" />
        <ChoiceList
          prompt="What does Mara do?"
          choices={CHOICES}
          disabled={false}
          onChoose={onChoose}
        />
      </>,
    );
    fireEvent.keyDown(window, { key: "4" });
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Notes" }), { key: "1" });

    rerender(
      <ChoiceList prompt="What does Mara do?" choices={CHOICES} disabled onChoose={onChoose} />,
    );
    fireEvent.keyDown(window, { key: "1" });

    expect(onChoose).not.toHaveBeenCalled();
  });
});

describe("[READ-THREAD-001] thread and endings", () => {
  it("lists the reader's choices in order with untaken paths for screen readers", () => {
    render(
      <Thread
        steps={[
          { label: "Kept the brass key", chapter: "Chapter Two", untaken: 2 },
          { label: "Burn it in the grate", chapter: "Chapter Three", untaken: 1 },
        ]}
        position="You are here: Ash"
      />,
    );
    const items = within(screen.getByRole("list", { name: "Your thread" })).getAllByRole(
      "listitem",
    );
    expect(items.map((item) => item.textContent)).toEqual([
      "Kept the brass keyChapter Two2 paths not taken",
      "Burn it in the grateChapter Three1 path not taken",
      "You are here: Ash",
    ]);
  });

  it("names found endings and leaves the rest unnamed", () => {
    render(<EndingsFound total={4} found={["Number Nine"]} />);
    expect(screen.getByText("1 of 4")).toBeTruthy();
    expect(screen.getByText("Number Nine")).toBeTruthy();
    expect(screen.getAllByText("Undiscovered")).toHaveLength(3);
  });
});
