import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SiteNav } from "./site-nav";

vi.mock("next/navigation", () => ({ usePathname: () => "/wall" }));

const ITEMS = [
  { href: "/wall", label: "The Wall" },
  { href: "/write", label: "Write" },
];

describe("[DS-NAV-001] primary navigation", () => {
  it("marks the current page in the navigation", () => {
    render(<SiteNav items={ITEMS} />);
    const current = screen.getAllByRole("link", { name: "The Wall" });
    expect(current.every((link) => link.getAttribute("aria-current") === "page")).toBe(true);
    expect(
      screen.getAllByRole("link", { name: "Write" })[0]!.getAttribute("aria-current"),
    ).toBeNull();
  });

  it("opens and closes the small-screen menu with a disclosure button", async () => {
    render(<SiteNav items={ITEMS} />);
    const button = screen.getByRole("button", { name: "Menu" });
    const menu = document.getElementById(button.getAttribute("aria-controls")!)!;

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(menu.hidden).toBe(true);

    await userEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(menu.hidden).toBe(false);
    expect(within(menu).getByRole("link", { name: "Write" })).toBeTruthy();

    await userEvent.click(button);
    expect(menu.hidden).toBe(true);
  });
});
