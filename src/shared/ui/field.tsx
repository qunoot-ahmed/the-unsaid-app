import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

const control =
  "w-full border border-control-border bg-surface px-3.5 text-[1rem] text-text placeholder:text-text-secondary focus-visible:border-accent aria-invalid:border-danger disabled:opacity-60";

interface FieldFrameProps {
  id: string;
  label: ReactNode;
  help?: ReactNode;
  error?: ReactNode;
  children: (describedBy: string | undefined) => ReactNode;
}

function FieldFrame({ id, label, help, error, children }: FieldFrameProps) {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, helpId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-help font-bold text-text">
        {label}
      </label>
      {children(describedBy)}
      {error ? (
        <p id={errorId} className="text-help text-danger">
          {error}
        </p>
      ) : null}
      {help ? (
        <p id={helpId} className="text-help text-text-secondary">
          {help}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  id: string;
  label: ReactNode;
  help?: ReactNode;
  error?: ReactNode;
};

export function TextField({ id, label, help, error, className, ...props }: TextFieldProps) {
  return (
    <FieldFrame id={id} label={label} help={help} error={error}>
      {(describedBy) => (
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(control, "min-h-12", className)}
          {...props}
        />
      )}
    </FieldFrame>
  );
}

type TextAreaProps = Omit<ComponentProps<"textarea">, "id"> & {
  id: string;
  label: ReactNode;
  help?: ReactNode;
  error?: ReactNode;
  /** Bare fields sit on a sheet of their own, as in the composer: no border, background or padding. */
  bare?: boolean;
};

const bareControl =
  "w-full resize-y border-0 bg-transparent p-0 text-text placeholder:text-text-secondary aria-invalid:outline aria-invalid:outline-1 aria-invalid:outline-danger";

export function TextArea({
  id,
  label,
  help,
  error,
  bare = false,
  className,
  ...props
}: TextAreaProps) {
  return (
    <FieldFrame id={id} label={label} help={help} error={error}>
      {(describedBy) => (
        <textarea
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            bare ? bareControl : control,
            bare ? "" : "py-3",
            "font-reading leading-relaxed",
            className,
          )}
          {...props}
        />
      )}
    </FieldFrame>
  );
}
