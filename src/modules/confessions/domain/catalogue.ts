// Catalogue mark (DESIGN.md, archival metadata): four characters derived from a random public id.
// It is a display label, never a lookup key, and never sequential.

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // no 0, 1, I or O

export function catalogueMark(publicId: string): string {
  if (publicId.length === 0) {
    throw new Error("A public id is required to derive a catalogue mark.");
  }
  // FNV-1a 32-bit hash: small, deterministic and well distributed for short ids.
  let hash = 0x811c9dc5;
  for (const character of publicId) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  let mark = "";
  for (let index = 0; index < 4; index += 1) {
    mark += ALPHABET.charAt(hash % ALPHABET.length);
    hash = Math.floor(hash / ALPHABET.length);
  }
  return mark;
}
