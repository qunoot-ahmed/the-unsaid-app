"use client";

import { useRef, useState } from "react";
import { Button, Dialog, RadioCards, StatusLine } from "@/shared/ui";

export function DialogSpecimen() {
  const [open, setOpen] = useState(false);
  const [outcome, setOutcome] = useState("");
  const keepRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="danger"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="self-start"
      >
        Delete a letter
      </Button>
      <StatusLine>{outcome}</StatusLine>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setOutcome("Kept. Nothing was deleted.");
        }}
        title="Delete this letter?"
        description="It will be removed from the Wall immediately. This cannot be undone. This is a demonstration; nothing is deleted."
        initialFocusRef={keepRef}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="danger"
            onClick={() => {
              setOpen(false);
              setOutcome("Demonstration only: the letter would now be deleted.");
            }}
          >
            Delete letter
          </Button>
          <Button
            ref={keepRef}
            variant="secondary"
            onClick={() => {
              setOpen(false);
              setOutcome("Kept. Nothing was deleted.");
            }}
          >
            Keep it
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export function RadioSpecimen() {
  const [value, setValue] = useState<"open" | "sealed">("open");
  return (
    <RadioCards
      name="specimen-visibility"
      legend="Who may read it?"
      value={value}
      onChange={setValue}
      options={[
        { value: "open", label: "Open letter", description: "Anyone on the Wall reads it." },
        { value: "sealed", label: "Sealed letter", description: "Readers choose to open it." },
      ]}
    />
  );
}
