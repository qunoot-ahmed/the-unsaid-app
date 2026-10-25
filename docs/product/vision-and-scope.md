# Vision and scope

## Vision

The Unsaid is a quiet place to leave the things people never said aloud, and a library of stories that change with the reader's choices. It should feel like entering a private literary world: intimate, mysterious and calm, with no follower counts or engagement mechanics.

## Audience

Readers and writers who journal, read interactive fiction or long-form web fiction, and want intimacy without performance.

## MVP scope

- Accounts with invite codes, unique pen names, profiles and account deletion.
- The Whisper Wall: drafts, release, deletion, mood rooms, folded and sealed letters, three fixed reactions.
- The Letter composer with autosave and server-confirmed publication.
- Reporting, automatic hiding after three distinct reports, a moderation queue and audited access to sealed text.
- Stories built from scenes and choices with validation and versioned publishing.
- The reader with saved choices, resume, restart, endings found, saved stories and The Thread.

## Out of scope for the MVP

Comments, notifications, following, search beyond filters, uploads and cover images, story variables and conditional choices, a visual story graph editor, AI moderation, internationalisation and offline use.

## Milestones

| Milestone | Objective                                         |
| --------- | ------------------------------------------------- |
| 0         | Reproducible, verified foundations                |
| 1         | Design system primitives and specimen page        |
| 2         | Accounts, pen names, authorization, rate limiting |
| 3         | Whisper Wall and The Letter                       |
| 4         | Reporting and moderation                          |
| 5         | Story engine and studio                           |
| 6         | Reader, Library and The Thread                    |
| 7         | Hardening and first release                       |

## Relationship to RiskPilot

The Unsaid will later be the reference application for RiskPilot, a separate test impact analysis tool. The Unsaid stays an independent application: no code exists to make RiskPilot look successful. It supports that future work only through ordinary good practice: feature modules with enforced boundaries, requirement IDs in test names, deterministic tests and published dependency and coverage reports.
