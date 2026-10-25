# Security and privacy

Every sensitive decision is made on the server for every request. CSS, hidden elements and client-side checks are presentation only and are never the protection.

## Principles

- Authorization runs in module services after the session check, for every Server Action and route handler.
- Public data leaves the server only through explicit mappers that select the columns they need.
- Not found and not allowed return the same 404 for content, so responses never reveal whether hidden or deleted items exist.
- The client sends intents (release, delete, hide), never target states. The server decides the resulting state inside a transaction.
- Private pages are never cached in a shared layer.
- Logs carry request id, user id, action and outcome. They never contain confession bodies, story text, report notes or email addresses.

## Anonymous authorship

- Confessions store the author id privately for ownership, deletion and moderation.
- No public mapper, page, payload or moderator view exposes the author of a confession. Only an operator with direct database access can see it.
- Public identifiers are random; the catalogue mark is derived from the random id and is never sequential.
- The interface states honestly that people who know a writer may recognise their voice. The product never promises absolute anonymity.

## Sealed content

- The feed query never selects sealed bodies. A dedicated action returns one body after an explicit reveal, for a published, visible, sealed confession.
- Sealed bodies never appear in page metadata, preview images, search snippets, the homepage, server-rendered feed HTML, notifications or logs.
- Moderators view sealed text only by an explicit request while handling an open report. The server checks the moderator role, that the report is open and that it refers to the confession, then writes an audit row (moderator, confession reference, report, action, outcome, request id, time) in the same transaction as the read. If the audit write fails, no text is returned. Denied attempts are logged too.

## Branching stories

The client receives a per-reader view of a story graph. Titles of undiscovered endings are never sent, including in metadata.

## Secrets and credentials

- .env is ignored by Git; only .env.example with placeholder values is committed.
- Local database credentials are generated per machine. CI uses throwaway credentials for a service container that exists only during the job.
- Production secrets will be held by the hosting provider (Milestone 7).

## Abuse prevention

Invite-only sign-up for the public demo, rate limits on sign-in, release, reactions and reports, automatic hiding after three distinct reports, and an at-risk report reason that is reviewed first.

## Data retention and deletion

- Deleting a confession removes it immediately.
- Deleting an account removes the profile, confessions, stories, drafts, progress and saves in one transaction after a recent sign-in. Reports the user filed remain without the reporter.
- Audit rows are kept for 12 months (to be confirmed before the public demo), then removed by a scheduled job.

## Verification

Security tests use canary values (an author pen name, a sealed body phrase, an undiscovered ending title) and assert they never appear in HTML or server component payloads. Cross-user access tests assert 404.
