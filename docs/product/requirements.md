# Requirements

Every requirement has a stable ID used in test names. A requirement is accepted only when all its criteria pass in CI. Status is updated in the same pull request that changes it.

## Milestone 0: foundations

| ID             | Requirement                  | Acceptance criteria                                                                                                       | Status                              |
| -------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| FND-DB-001     | Database connectivity        | Prisma with the pg adapter runs a query against PostgreSQL 17                                                             | Implemented                         |
| FND-DB-002     | Connectivity check behaviour | The check reports version and latency on success and fails without throwing on error                                      | Implemented                         |
| FND-TOKENS-001 | Token contrast               | Every allowed text and background token pair is at least 4.5:1 in both themes; fill-only colours stay below text contrast | Implemented                         |
| FND-WRITE-001  | Documentation writing rule   | Backticks, em dashes, en dashes and other long dashes in Markdown are reported with line and column                       | Implemented                         |
| FND-WRITE-002  | Content writing rule         | Long dashes in project-authored content files are reported; backticks are allowed there                                   | Implemented                         |
| FND-WRITE-003  | File classification          | Only documentation and content files are checked; source code and user data are not                                       | Implemented                         |
| FND-UI-001     | Foundation page              | The page renders the wordmark and tagline with the document language set to English                                       | Implemented                         |
| FND-A11Y-001   | Automated accessibility      | Axe reports no serious or critical violations on every page                                                               | Implemented for the foundation page |
| FND-MOTION-001 | Reduced motion               | No animation runs when the user prefers reduced motion                                                                    | Implemented for the foundation page |

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
| CONF-008  | Catalogue mark        | Derived from the random public id; never sequential                                                                                                          | 3         |
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
