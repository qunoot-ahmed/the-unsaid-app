// Joins class names, skipping empty values. Kept local to avoid a dependency for one line.
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
