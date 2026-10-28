import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HOMEPAGE_CONFESSION } from "../content";
import { LiftedInk } from "./lifted-ink";
import { TwoDoors } from "./two-doors";

const sentence = HOMEPAGE_CONFESSION.segments.map((segment) => segment.text).join("");

describe("[HOME-INK-001] The Lifted Ink", () => {
  it("keeps the full sentence in the page while inked, for screen readers", () => {
    const { container } = render(<LiftedInk segments={HOMEPAGE_CONFESSION.segments} />);
    expect(container.querySelector("p")!.textContent).toBe(sentence);
  });

  it("reveals every phrase with one labelled toggle and settles them again", async () => {
    const { container } = render(<LiftedInk segments={HOMEPAGE_CONFESSION.segments} />);
    const button = screen.getByRole("button", { name: "Lift the ink" });
    const inked = () =>
      [...container.querySelectorAll("[data-inked]")].map((node) =>
        node.getAttribute("data-inked"),
      );

    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(inked()).toEqual(["true", "true", "true"]);

    await userEvent.click(button);
    expect(
      screen.getByRole("button", { name: "Let the ink settle" }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(inked()).toEqual(["false", "false", "false"]);
    expect(container.querySelector("p")!.textContent).toBe(sentence);

    await userEvent.click(screen.getByRole("button", { name: "Let the ink settle" }));
    expect(inked()).toEqual(["true", "true", "true"]);
  });

  it("explains the toggle to assistive technology", () => {
    render(<LiftedInk segments={HOMEPAGE_CONFESSION.segments} />);
    const button = screen.getByRole("button", { name: "Lift the ink" });
    const description = document.getElementById(button.getAttribute("aria-describedby")!);
    expect(description!.textContent).toContain("Screen readers already read the full sentence.");
  });
});

describe("[HOME-DOORS-001] the two doors", () => {
  it("previews the chosen room and ends in a real link", async () => {
    render(<TwoDoors />);
    const wallDoor = screen.getByRole("button", { name: /Listen to what others never said/ });
    expect(screen.getByText("Choose a door to look inside.")).toBeTruthy();

    await userEvent.click(wallDoor);
    expect(wallDoor.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("link", { name: "Enter the Wall" }).getAttribute("href")).toBe("/wall");

    const libraryDoor = screen.getByRole("button", { name: /Step into a story/ });
    await userEvent.click(libraryDoor);
    expect(wallDoor.getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByRole("link", { name: "Open the story" })).toBeTruthy();
  });
});
