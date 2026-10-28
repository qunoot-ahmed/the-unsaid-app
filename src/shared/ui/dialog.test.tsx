import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { Dialog } from "./dialog";

function Harness() {
  const [open, setOpen] = useState(false);
  const keepRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Delete a letter
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete this letter?"
        description="This cannot be undone."
        initialFocusRef={keepRef}
      >
        <Button variant="danger" onClick={() => setOpen(false)}>
          Delete letter
        </Button>
        <Button ref={keepRef} variant="secondary" onClick={() => setOpen(false)}>
          Keep it
        </Button>
      </Dialog>
    </>
  );
}

describe("[DS-DIALOG-001] dialog focus behaviour", () => {
  it("is named by its title and described by its description", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Delete a letter" }));

    const dialog = screen.getByRole("dialog", { name: "Delete this letter?" });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("opens with focus on the least destructive action", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Delete a letter" }));

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Keep it" }));
  });

  it("keeps Tab and Shift Tab inside the dialog", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Delete a letter" }));

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Delete letter" }));
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Keep it" }));
  });

  it("closes on Escape and returns focus to the button that opened it", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const opener = screen.getByRole("button", { name: "Delete a letter" });
    await user.click(opener);

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});
