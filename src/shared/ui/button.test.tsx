import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { TextField } from "./field";

describe("[DS-BUTTON-001] buttons", () => {
  it("describes pending work, stays disabled and reports busy", () => {
    render(
      <Button pending pendingLabel="Releasing">
        Release it
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Releasing" });
    expect(button).toHaveProperty("disabled", true);
    expect(button.getAttribute("aria-busy")).toBe("true");
  });

  it("defaults to type button so it never submits a form by accident", () => {
    render(<Button>Seal</Button>);
    expect(screen.getByRole("button", { name: "Seal" }).getAttribute("type")).toBe("button");
  });
});

describe("[DS-FIELD-001] fields", () => {
  it("links the label, the error and the help text to the input", () => {
    render(
      <TextField
        id="email"
        label="Email"
        error="Enter an email address."
        help="Never shown to anyone."
      />,
    );
    const input = screen.getByRole("textbox", { name: "Email" });

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("email-error email-help");
    expect(document.getElementById("email-error")!.textContent).toBe("Enter an email address.");
  });

  it("is not marked invalid without an error", () => {
    render(<TextField id="pen" label="Pen name" />);
    expect(
      screen.getByRole("textbox", { name: "Pen name" }).getAttribute("aria-invalid"),
    ).toBeNull();
  });
});
