# Requirements

Every requirement has a stable ID used in test names. A requirement is accepted only when all its criteria pass in CI. Status is updated in the same pull request that changes it.

## Milestone 0: foundations

| ID             | Requirement                  | Acceptance criteria                                                                                                                                           | Status                                |
| -------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| FND-DB-001     | Database connectivity        | Prisma with the pg adapter runs a query against PostgreSQL 17                                                                                                 | Implemented                           |
| FND-DB-002     | Connectivity check behaviour | The check reports version and latency on success and fails without throwing on error                                                                          | Implemented                           |
| FND-TOKENS-001 | Token contrast               | Every allowed text and background token pair is at least 4.5:1 in both themes; fill-only colours stay below text contrast                                     | Implemented                           |
| FND-WRITE-001  | Documentation writing rule   | Backticks, em dashes, en dashes and other long dashes in Markdown are reported with line and column                                                           | Implemented                           |
| FND-WRITE-002  | Content writing rule         | Long dashes in project-authored content files are reported; backticks are allowed there                                                                       | Implemented                           |
| FND-WRITE-003  | File classification          | Only documentation and content files are checked; source code and user data are not                                                                           | Implemented                           |
| FND-UI-001     | Application shell            | Pages render the wordmark and tagline with the document language set to English; a skip link reaches the main content; unknown routes show the not-found page | Implemented                           |
| FND-A11Y-001   | Automated accessibility      | Axe reports no serious or critical violations on every page                                                                                                   | Implemented for the Milestone 1 pages |
| FND-MOTION-001 | Reduced motion               | No animation runs when the user prefers reduced motion                                                                                                        | Implemented for the Milestone 1 pages |

## Milestone 1: design system and UI foundations

Milestone 1 screens are demonstrations with fictional content. Nothing is stored, published or attributed to an account, and every demonstration screen says so. The persistent versions of these behaviours are the Milestone 3 and 6 requirements below.

| ID              | Requirement                       | Acceptance criteria                                                                                                                                                       | Status      |
| --------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| DS-NAV-001      | Primary navigation                | Links mark the current page with aria-current; on small screens a Menu button with aria-expanded opens and closes the same list; works with the keyboard alone            | Implemented |
| DS-BUTTON-001   | Buttons                           | Four variants and two sizes; pending buttons keep their size, show the pending label, are disabled and set aria-busy                                                      | Implemented |
| DS-FIELD-001    | Fields                            | Every field has a visible label; help and error text are linked with aria-describedby; invalid fields set aria-invalid                                                    | Implemented |
| DS-DIALOG-001   | Dialog                            | Opens on the least destructive action, traps Tab and Shift+Tab, closes on Escape and returns focus to the control that opened it                                          | Implemented |
| HOME-INK-001    | The Lifted Ink                    | A labelled button lifts and settles all inked phrases with aria-pressed; the full sentence is real text for screen readers; hover reveal only on fine pointers            | Implemented |
| HOME-DOORS-001  | Two doors                         | Each door is a toggle button that updates a polite preview ending in a real link                                                                                          | Implemented |
| WALL-MOOD-001   | Mood rooms                        | Rooms are links with the mood in the URL; the current room is marked; the accent and room line change; an unknown mood shows all rooms                                    | Implemented |
| WALL-REACT-001  | Demonstration reactions           | Three toggles with aria-pressed and a count that changes; labelled as not saved                                                                                           | Implemented |
| CONF-FOLD-001   | Folded letter                     | Bodies over 600 characters fold at a sentence boundary; the remainder is not rendered until unfolded; the control uses aria-expanded and states the reading time          | Implemented |
| CONF-SEAL-001   | Content note for sealed letters   | The composer refuses a sealed letter without a content note                                                                                                               | Implemented |
| CONF-SEAL-002   | Sealed text absent from the Wall  | The Wall view model and its server-rendered HTML contain no sealed body                                                                                                   | Implemented |
| CONF-SEAL-003   | Breaking the seal                 | The body arrives only from an explicit server action for one letter; sealed, opening, open and error states are announced; works by keyboard                              | Implemented |
| CONF-PUB-001    | Composer steps                    | Writing, sealing and released steps; body 10 to 2000 characters; mood required; focus moves to the step heading                                                           | Implemented |
| CONF-PUB-002    | Release decided by the server     | Released only after the server action confirms; a server failure keeps the letter and offers retry                                                                        | Implemented |
| CONF-PUB-003    | Preview release stores nothing    | The preview action validates on the server, returns a catalogue mark and writes nothing                                                                                   | Implemented |
| CONF-PUB-004    | Release without motion or a mouse | The full flow completes with reduced motion and the keyboard alone                                                                                                        | Implemented |
| CONF-PUB-006    | No logic on animation events      | No source file listens for animation or transition events                                                                                                                 | Implemented |
| READ-THREAD-001 | Reader choices and the thread     | Choosing adds a thread step and moves focus to the new scene heading; number keys 1 to 4 choose; untaken paths show only as a count; endings found survive starting again | Implemented |
| READ-THREAD-002 | Reader action validation          | Malformed or impossible paths and choices return one recoverable message                                                                                                  | Implemented |
| READ-MAP-001    | No undiscovered endings sent      | Neither the view model nor the page HTML contains undiscovered ending titles or choice destinations                                                                       | Implemented |
| A11Y-KEY-001    | Keyboard-only signature flows     | Each signature flow is reached with Tab and completed with Enter or Space, on desktop and mobile layouts                                                                  | Implemented |
| RESP-001        | Responsive layout                 | No horizontal overflow at 320, 375, 390, 768, 1024 and 1440 px on every page; key interactions work at 320 px                                                             | Implemented |
| RESP-002        | Touch targets                     | Interactive controls are at least 44 by 44 px at 375 px, except inline text links                                                                                         | Implemented |
| VIS-001         | Visual regression                 | Eight approved screens match their baselines in the pinned Playwright container                                                                                           | Implemented |

Implemented means the tests listed in docs/testing/test-matrix.md ran and passed locally. Manual accessibility checks that are still pending are listed in docs/testing/strategy.md.

## MVP requirements

| ID        | Requirement           | Acceptance criteria                                                                                                                                          | Milestone |
| --------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| AUTH-001  | Join with invite      | Valid code, email and password create an account; used or unknown code is rejected with a field message; codes are single use                                | 2         |
| AUTH-002  | Sign in and out       | Correct credentials start a session; 5 failures in 15 minutes per account and address return a rate-limit message; sign out ends the session on the server   | 2         |
| PROF-001  | Unique pen name       | 3 to 24 letters, digits or spaces; uniqueness ignores case and repeated spaces and is enforced by a database constraint                                      | 2         |
| PROF-002  | Public profile        | Shows pen name, bio and published stories only; never confessions, email or drafts                                                                           | 2         |
| ACC-001   | Account deletion      | Typed pen name confirmation and recent sign-in; deletes profile, confessions, stories, drafts, progress and saves; reports filed remain without the reporter | 2         |
| CONF-001  | Drafts                | Autosave within 1 second of typing stopping; drafts visible only to their owner                                                                              | 3         |
| CONF-002  | Release               | Requires a mood; sealed requires a content note; confirmation appears only after the server returns the created confession                                   | 3         |
| CONF-003  | Delete own confession | Owner deletes after confirmation; it disappears from the Wall immediately; other users receive 404                                                           | 3         |
| CONF-004  | Wall feed             | Newest first, cursor pagination of 20, mood filter by URL parameter, hidden and draft items never included                                                   | 3         |
| CONF-005  | Reactions             | Three fixed reactions, one of each per user per confession, idempotent toggle, counts correct after reload                                                   | 3         |
| CONF-006  | Folded letters        | Bodies over 600 characters fold; unfolding is client only                                                                                                    | 3         |
| CONF-007  | Sealed letters        | Feed returns no sealed body; body is fetched by explicit reveal; reload returns to sealed                                                                    | 3         |
| CONF-008  | Catalogue mark        | Derived from the random public id; never sequential (the derivation function exists from Milestone 1)                                                        | 3         |
| PRIV-001  | Anonymous authorship  | No public response, HTML or payload contains author id, pen name or email for a confession                                                                   | 3         |
| RATE-001  | Rate limits           | Release 5 per hour, report 10 per day, reaction 60 per minute per user; message states when to retry                                                         | 3 and 4   |
| RPT-001   | Report                | Signed-in user reports once per item with a required reason; reporter identity never shown to the writer                                                     | 4         |
| RPT-002   | Automatic hiding      | Three distinct open reports hide the item pending review                                                                                                     | 4         |
| MOD-001   | Moderation actions    | Moderator hides or restores; restore dismisses open reports; every action is logged                                                                          | 4         |
| MOD-002   | Sealed access         | Moderator requests sealed text explicitly; each access is written to the audit log before the text is returned                                               | 4         |
| STORY-001 | Author a story        | Owner creates scenes, choices (1 to 4 per scene) and endings; only the owner can edit                                                                        | 5         |
| STORY-002 | Validation            | Publish is refused while any rule fails; the same validator runs on the server at publish                                                                    | 5         |
| STORY-003 | Versioned publish     | Publishing creates an immutable version; readers mid-story keep their version until they start a new thread                                                  | 5         |
| READ-001  | Choices and progress  | Choosing saves the step on the server; a stale choice from another tab returns a conflict                                                                    | 6         |
| READ-002  | Resume and restart    | Returning resumes at the saved scene; a new thread keeps endings found                                                                                       | 6         |
| READ-003  | Endings found         | Count and found titles are correct; undiscovered titles are never sent                                                                                       | 6         |
| READ-004  | Saved stories         | Save and remove from the Library, story details and Saved                                                                                                    | 6         |

## Journeys

Each journey becomes one Playwright specification tagged with its ID: JRN-JOIN, JRN-CONFESS, JRN-WALL, JRN-READ, JRN-AUTHOR and JRN-MODERATE. Their steps are listed in the implementation handoff and will be copied into the specifications when each milestone starts.
