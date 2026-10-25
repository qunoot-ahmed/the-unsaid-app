# 0003: One scene graph with versioned publishing

Status: Accepted, implemented in Milestone 5

## Context

The Library holds both linear chaptered stories and branching stories. Readers must never see broken links, unreachable scenes or progress corrupted by later edits.

## Options considered

1. Separate models for chapters and for branching nodes.
2. One model of scenes and choices, edited in place.
3. One model of scenes and choices, with a mutable draft version and immutable published versions.

## Decision

Option 3. A linear story is a chain of scenes with one "Continue" choice each; a chapter is a title on the scene that opens it. Publishing validates the draft and copies it into a new immutable version in one transaction. Reading progress refers to a version and a stable scene key.

## Consequences

- One code path for progress, validation and reading.
- Edits never corrupt in-flight progress; readers keep their version until they start a new thread.
- Publishing costs a copy of the graph, which is acceptable at MVP scale (at most 200 scenes per story).
- Composite foreign keys keep choices inside one version.
