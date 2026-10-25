# 0004: Rate limiting in PostgreSQL

Status: Accepted, implemented in Milestone 2

## Context

Sign-in, release, reactions and reports need rate limits. Traffic is small; operational simplicity matters more than throughput.

## Options considered

1. Redis or a hosted rate-limit service.
2. In-memory counters per process.
3. A fixed-window counter table in PostgreSQL updated with an atomic upsert.

## Decision

Option 3. One table keyed by limit name, subject and window start.

## Consequences

- No extra infrastructure; limits survive restarts and work across instances.
- Each limited request costs one small write; acceptable at MVP traffic.
- Old windows are removed by a periodic cleanup, scheduled once hosting is chosen.
