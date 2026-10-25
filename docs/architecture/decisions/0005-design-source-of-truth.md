# 0005: The repository is the design source of truth

Status: Accepted (Milestone 0)

## Context

The design was explored and approved on an interactive design canvas, then written up as Design Specification v1.0 and an implementation handoff. Implementation needs one authority that changes together with the code.

## Decision

DESIGN.md and src/shared/design/tokens.css are authoritative from Milestone 0. The canvas remains visual reference only. A design change is reviewed on the canvas, then applied to DESIGN.md and the tokens in the same pull request as the code that uses it. Token contrast is checked by a unit test.

## Consequences

- Design and implementation cannot drift silently.
- Canvas artboards are not pixel baselines; visual regression baselines are captured from the running application once each screen is accepted.
