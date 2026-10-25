# Data model

Status: planned. No domain tables exist in Milestone 0. Each entity is created in the milestone that first needs it, with a migration and integration tests for its constraints.

## Entities

| Entity                               | Purpose                                           | Key constraints                                                                                   | Milestone |
| ------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------- |
| User, Session, Account, Verification | Managed by Better Auth                            | As defined by the library                                                                         | 2         |
| InviteCode                           | Invite-only sign-up                               | code unique; single use inside the sign-up transaction                                            | 2         |
| Profile                              | Pen name, bio, role (USER or MODERATOR)           | penNameNormalized unique                                                                          | 2         |
| Confession                           | Draft, published or hidden letter                 | publicId random and unique; catalogueMark derived from publicId; CHECK sealed implies contentNote | 3         |
| ReleaseAttempt                       | Idempotent release                                | idempotencyKey unique                                                                             | 3         |
| ConfessionReaction                   | Three fixed reactions                             | primary key (confessionId, userId, kind)                                                          | 3         |
| ContentReport                        | Private report with a reason                      | unique per reporter and item; exactly one target; reporter set null on account deletion           | 4         |
| SealedAccessLog                      | Audit of moderator actions and sealed text access | insert only for the application role; no text columns; confession id stored as a plain value      | 4         |
| Story                                | A story owned by its author                       | slug unique                                                                                       | 5         |
| StoryVersion                         | Draft or immutable published version              | unique (storyId, number); one draft per story                                                     | 5         |
| Scene                                | Node in the story graph                           | unique (versionId, key)                                                                           | 5         |
| Choice                               | Edge between scenes in one version                | composite foreign keys keep both ends in the same version                                         | 5         |
| ReadingProgress, ProgressStep        | Saved position and choices                        | revision column for optimistic concurrency                                                        | 6         |
| EndingDiscovery                      | Endings a reader has found                        | unique (userId, storyId, endingKey)                                                               | 6         |
| Bookmark                             | Saved stories                                     | primary key (userId, storyId)                                                                     | 6         |
| RateLimitBucket                      | Fixed-window rate limits                          | primary key (key, windowStart)                                                                    | 2         |

## Enumerations

- Mood: LONGING, REGRET, RELIEF, FEAR, TENDERNESS, ANGER, SHAME, HOPE.
- ContentNote: GRIEF_LOSS, ILLNESS, SELF_HARM, ABUSE, OTHER_HEAVY.
- ReportReason: PRIVATE_DETAILS, HARASSMENT, AT_RISK, SPAM, OTHER.
- Audit action: VIEW_SEALED, HIDE, RESTORE, DISMISS; outcome ALLOWED or DENIED.

## Rules that live in the database

- Uniqueness and foreign keys are database constraints, never only application checks.
- Choices cannot point to a scene in another version (composite foreign keys).
- A sealed confession must have a content note (CHECK constraint).
- Deleting a confession removes its reactions and closes its open reports; audit rows remain with the id only.

## Per-reader story view

The reader never receives the full story graph. A domain function builds a per-reader view: visited scenes and found endings with titles, glimpsed scenes without titles, undiscovered endings as opaque placeholders.
