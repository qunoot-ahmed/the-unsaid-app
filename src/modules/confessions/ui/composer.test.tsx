import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Composer } from "./composer";

const previewRelease = vi.hoisted(() => vi.fn());
vi.mock("../server/demo-actions", () => ({ previewRelease }));

const LETTER = "I never told her I was the one who called.";

async function writeAndSeal(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole("textbox", { name: "Your letter" }), LETTER);
  await user.click(screen.getByRole("button", { name: "Seal this letter" }));
}

beforeEach(() => {
  previewRelease.mockReset();
});

describe("[CONF-PUB-001] The Letter composer", () => {
  it("says plainly that nothing is stored in preview mode", () => {
    render(<Composer />);
    expect(screen.getByText(/never stored or published/)).toBeTruthy();
  });

  it("explains a letter that is too short and stays on the writing step", async () => {
    const user = userEvent.setup();
    render(<Composer />);
    await user.type(screen.getByRole("textbox", { name: "Your letter" }), "Short");
    await user.click(screen.getByRole("button", { name: "Seal this letter" }));

    expect(screen.getByRole("textbox", { name: "Your letter" }).getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(screen.getByText("Write at least 10 characters.")).toBeTruthy();
  });

  it("moves focus to the seal step heading and previews exactly what others see", async () => {
    const user = userEvent.setup();
    render(<Composer />);
    await writeAndSeal(user);

    expect(document.activeElement).toBe(screen.getByRole("heading", { name: "Seal the letter" }));
    expect(screen.getByText("Shown as: Anonymous · today")).toBeTruthy();
    expect(screen.getByText(LETTER)).toBeTruthy();
  });

  it("requires a mood before contacting the server", async () => {
    const user = userEvent.setup();
    render(<Composer />);
    await writeAndSeal(user);
    await user.click(screen.getByRole("button", { name: "Release it" }));

    expect(screen.getByRole("alert").textContent).toBe("Choose a mood.");
    expect(previewRelease).not.toHaveBeenCalled();
  });
});

describe("[CONF-PUB-002] release waits for the server, never for an animation", () => {
  it("shows Releasing, then Released only after the server confirms", async () => {
    let confirm: (value: unknown) => void = () => {};
    previewRelease.mockReturnValue(new Promise((done) => (confirm = done)));
    const user = userEvent.setup();
    render(<Composer />);
    await writeAndSeal(user);
    await user.click(screen.getByRole("radio", { name: "Hope" }));
    await user.click(screen.getByRole("button", { name: "Release it" }));

    expect(screen.getByRole("button", { name: "Releasing" })).toHaveProperty("disabled", true);
    expect(screen.queryByRole("heading", { name: "Released." })).toBeNull();
    expect(previewRelease).toHaveBeenCalledWith(
      { body: LETTER, mood: "hope", visibility: "open", contentNote: null },
      false,
    );

    confirm({ ok: true, catalogueMark: "7F3K", day: "Today" });
    const heading = await screen.findByRole("heading", { name: "Released." });
    expect(document.activeElement).toBe(heading);
    expect(screen.getByText(/nothing was published or saved/)).toBeTruthy();
  });

  it("keeps the letter and offers a retry when the server fails", async () => {
    previewRelease.mockResolvedValue({
      ok: false,
      kind: "server",
      message: "We could not release your letter.",
    });
    const user = userEvent.setup();
    render(<Composer />);
    await writeAndSeal(user);
    await user.click(screen.getByRole("radio", { name: "Hope" }));
    await user.click(screen.getByRole("checkbox", { name: /simulate a server failure/ }));
    await user.click(screen.getByRole("button", { name: "Release it" }));

    expect((await screen.findByRole("alert")).textContent).toContain("Nothing was published.");
    expect(previewRelease).toHaveBeenCalledWith(expect.objectContaining({ body: LETTER }), true);
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
    expect(screen.getByText(LETTER)).toBeTruthy();
  });

  it("asks for a content note before releasing a sealed letter", async () => {
    const user = userEvent.setup();
    render(<Composer />);
    await writeAndSeal(user);
    await user.click(screen.getByRole("radio", { name: "Regret" }));
    await user.click(screen.getByRole("radio", { name: /Sealed letter/ }));
    await user.click(screen.getByRole("button", { name: "Release it" }));

    expect(
      screen
        .getByRole("combobox", { name: "What should readers know first?" })
        .getAttribute("aria-invalid"),
    ).toBe("true");
    expect(previewRelease).not.toHaveBeenCalled();
  });
});
