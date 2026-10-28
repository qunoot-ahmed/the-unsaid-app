import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "danger" | "text";
export type ButtonSize = "regular" | "large";

const base =
  "inline-flex items-center justify-center gap-2 font-ui font-bold text-ui no-underline transition-colors duration-[var(--motion-feedback)] disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border border-text bg-text px-6 text-ground hover:border-accent hover:bg-accent disabled:border-rule disabled:bg-rule disabled:text-text-secondary",
  secondary:
    "border border-control-border bg-transparent px-6 text-text hover:border-accent hover:bg-surface disabled:text-text-secondary",
  danger:
    "border border-danger bg-danger px-6 text-ground hover:opacity-90 disabled:border-rule disabled:bg-rule disabled:text-text-secondary",
  text: "px-1 text-link underline underline-offset-4 hover:text-text disabled:text-text-secondary",
};

const sizes: Record<ButtonSize, string> = {
  regular: "min-h-11",
  large: "min-h-13 w-full sm:w-auto",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "regular") {
  return cn(base, variants[variant], sizes[size]);
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** While pending the button keeps its size, shows pendingLabel and cannot be pressed again. */
  pending?: boolean;
  pendingLabel?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "regular",
  pending = false,
  pendingLabel,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonClasses(variant, size), className)}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      {...props}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  variant = "primary",
  size = "regular",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={cn(buttonClasses(variant, size), className)} {...props} />;
}
