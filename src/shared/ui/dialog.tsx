"use client";

import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Receives focus when the dialog opens. Use the least destructive action. */
  initialFocusRef?: RefObject<HTMLElement | null>;
}

// Modal dialog on the native dialog element. Behaviour required by DESIGN.md:
// focus moves inside on open, Tab and Shift Tab stay inside, Escape closes,
// and focus returns to the element that was focused before opening.
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  initialFocusRef,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    const first = initialFocusRef?.current ?? dialog.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    return () => {
      if (typeof dialog.close === "function" && dialog.open) {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
      returnFocusRef.current?.focus();
    };
  }, [open, initialFocusRef]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    const first = focusable.at(0);
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onKeyDown={handleKeyDown}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-x-0 bottom-0 m-0 w-full max-w-none border border-control-border bg-surface p-6 text-text backdrop:bg-black/70 sm:inset-auto sm:top-1/4 sm:left-1/2 sm:w-[min(30rem,calc(100%-2rem))] sm:-translate-x-1/2 sm:p-8"
    >
      <div className="flex flex-col gap-4">
        <h2 id={titleId} className="m-0 font-display text-display-4 font-normal italic">
          {title}
        </h2>
        {description ? (
          <p id={descriptionId} className="m-0 text-ui leading-relaxed text-text-body">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </dialog>
  );
}
