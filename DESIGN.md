# DESIGN

This is the approved design specification for The Unsaid, converted from Design Specification v1.0. It is the source of truth for implementation. Token values here must match src/shared/design/tokens.css; a unit test checks the contrast of every allowed text pair.

Visual reference: the design review canvas (Round 2 signatures and Round 3 screens are the approved baseline; Round 1 is history). If the canvas and this file disagree, this file wins.

## Principles

1. Reading first. Content sits on book typography; interface chrome stays quiet.
2. Secrets are revealed, never withheld. Every hidden thing has a visible, labelled way to reveal it that works with mouse, touch, keyboard and screen readers.
3. The server decides, the interface reports. Business state changes only on a confirmed server response.
4. Consent before weight. Heavy content is sealed by its writer and opened only by an explicit reader action.
5. One accent at a time. Colour carries meaning and is always paired with a text label.
6. Motion is optional. Every flow is complete with all animation removed.
7. No runtime dependencies for presentation effects. CSS transitions and keyframes only.

## Colour

Components use semantic tokens. The Parchment reading theme redefines only the semantic layer, under the attribute data-theme="parchment".

| Semantic token         | Ink (default) | Parchment | Use                            |
| ---------------------- | ------------- | --------- | ------------------------------ |
| --color-ground         | #121014       | #F3ECDF   | Page background                |
| --color-surface        | #1E1A1F       | #EAE1D0   | Raised surfaces, sealed card   |
| --color-sheet          | #1A1619       | #F3ECDF   | Letter sheet, previews         |
| --color-rule           | #2A2429       | #DDD2BF   | Dividers                       |
| --color-control-border | #3A3239       | #C9BCA6   | Control borders, ink redaction |
| --color-text           | #EFE6D6       | #221C21   | Primary text                   |
| --color-text-secondary | #A89EA6       | #5E5359   | Secondary text, receded chrome |
| --color-text-body      | #E4DBCC       | #2B2429   | Long-form reading              |
| --color-accent         | #C9A35E       | #7A5A1F   | Focus ring, default accent     |
| --color-link           | #D9A3AC       | #7E2D3B   | Links                          |
| --color-danger         | #E08A7E       | #9A2F2A   | Errors, destructive actions    |
| --color-success        | #9DB39A       | #4F5A3A   | Confirmations                  |

Palette values --color-ink-950 to --color-ink-700 hold the raw Ink ground scale. --color-burgundy (#7E2D3B) and --color-plum (#6E4A68) are fills only and never text on dark; a test asserts they stay below text contrast.

### Mood accents

A mood room sets --color-accent to its mood. Every mood is at least 6.5:1 on the Ink ground and is always shown with its name.

| Token                   | Value   | Room line                          |
| ----------------------- | ------- | ---------------------------------- |
| --color-mood-longing    | #D9A3AC | For the ones who are still missed. |
| --color-mood-regret     | #B58AAE | What people would undo.            |
| --color-mood-relief     | #9DB39A | Weights finally set down.          |
| --color-mood-fear       | #8FA3BF | Said quietly, with the lights off. |
| --color-mood-tenderness | #C9A35E | Love that went unspoken.           |
| --color-mood-anger      | #D08B6A | What was swallowed instead.        |
| --color-mood-shame      | #A89A90 | What people still carry alone.     |
| --color-mood-hope       | #CFC48E | Small lights, kept going.          |

## Typography

| Token          | Family                     | Use                                                          |
| -------------- | -------------------------- | ------------------------------------------------------------ |
| --font-display | Newsreader, optical sizing | Headings and voice. Italic for voice, upright for structure. |
| --font-reading | Literata, optical sizing   | Long-form reading and confessions                            |
| --font-ui      | Atkinson Hyperlegible Next | Controls, labels, metadata                                   |

Fonts are self-hosted through next/font. Sizes: --text-display-1 to --text-display-5 (76, 56, 42, 30, 26 px), --text-reading (20 px), --text-reading-compact (18 px, mobile reader), --text-ui (15 px), --text-help (14 px), --text-label (12 px small caps tracked 0.14 em). Reading measure is 60 to 68 characters (--measure is 66ch). No text below 12 px.

## Space, layout and breakpoints

- Spacing base is 4 px (Tailwind --spacing). The approved scale is 4, 8, 12, 16, 24, 32, 48, 72 and 120 px, which are Tailwind steps 1, 2, 3, 4, 6, 8, 12, 18 and 30.
- Grid: 12 columns, 24 px gutter (--gutter), 1280 px maximum (--content-max). A margin column carries metadata and the thread; content sits at reading measure.
- Breakpoints: base 0 to 639 px single column with 16 px gutters; sm 640; md 960 (margin column appears); lg 1280.
- Touch targets: 44 by 44 px minimum (--target-min); primary mobile actions 52 px tall; 8 px between adjacent targets.

## Motion

| Token             | Duration | Use                                             |
| ----------------- | -------- | ----------------------------------------------- |
| --motion-feedback | 120 ms   | Hover, pressed, toggles                         |
| --motion-state    | 200 ms   | Room accent, theme, tab change                  |
| --motion-discover | 360 ms   | Scene entrance, unfold, thread growth, ink lift |
| --motion-moment   | 700 ms   | Ending map reveal, release confirmation only    |

Animate transform, opacity and at most one filter. No looping or ambient animation. Under reduced motion all tokens are 0 ms and global styles remove every animation and transition. No business logic listens for animation or transition events.

## Archival metadata

Set in interface small caps (12 px, tracked 0.14 em, tabular figures).

- Catalogue mark, for example "No. 7F3K", on every published confession before the mood mark. Four characters derived from the random public id; never sequential.
- Printed as line, "Shown as: Anonymous · today", under the composer preview and on rows in Me, Letters.
- Receive checklist, "What other readers receive", in onboarding and on the privacy page: words, mood and day included; pen name and account excluded, each item with a text label.

## Signature experiences

### The Lifted Ink (homepage)

- A fixed, project-authored confession with three inked phrases. Never live user content.
- One button, "Lift the ink" or "Let the ink settle", reveals all phrases for every input method. Hover reveals a single phrase only on devices that report hover. Touch hint names the button.
- The full sentence is real text and screen readers read it unredacted; the button carries aria-pressed and a description saying so.
- Two doors ("Listen to what others never said", "Step into a story that answers to you") are buttons with aria-pressed controlling a polite live preview; each preview ends in a real link.

### Folded letters, sealed letters and mood rooms (Whisper Wall)

|                      | Folded                              | Sealed                                     |
| -------------------- | ----------------------------------- | ------------------------------------------ |
| Decided by           | Interface: body over 600 characters | Writer, with a required content note       |
| States               | Folded, Unfolded                    | Sealed, Opening, Open, Error               |
| Body in feed payload | Yes                                 | No                                         |
| Reveal               | Client only                         | Explicit server request for one confession |
| After reload         | Folded                              | Sealed                                     |

- Content notes: Grief and loss, Illness, Self-harm, Abuse, Something else heavy.
- Sealed bodies never appear in page metadata, preview images, search snippets, the homepage, server-rendered feed HTML, notifications or logs.
- Moderators see sealed text only by an explicit, server-checked, audit-logged request while handling an open report.
- Unfold and Break the seal are buttons with aria-expanded and aria-controls. Opening is announced in a polite live region; errors offer retry.
- Mood rooms are links (mood as a URL parameter). Changing room swaps the accent and the room line. No background tint or ambient effect.

### The Thread and the ending map (reader)

- The thread is an ordered list of saved choices; knots and dotted untaken-path marks are decoration hidden from assistive technology. Untaken paths show only as a count.
- Desktop: vertical in the margin. Mobile: a horizontal strip under the header that expands into the same list.
- The optional ending map shows visited scenes and found endings by title, glimpsed scenes as "Not yet followed", and undiscovered endings as "Undiscovered". It is hidden from assistive technology and replaced by a text summary.
- The client never receives titles of undiscovered endings.

### The Letter (composer)

- States: Draft (autosaved), Publishing, Released, Failed (draft kept). Released is entered only when the server returns the created confession.
- The optional fold animation plays over the confirmation screen and never controls state. Under reduced motion it is not shown.
- Each release attempt carries an idempotency key; retry never creates a duplicate.
- Receded chrome while writing uses --color-text-secondary, never opacity.

## Components

Each component ships with these states and appears on the development specimen page in both themes.

| Component                                 | States                                              |
| ----------------------------------------- | --------------------------------------------------- |
| Button (primary, secondary, danger, text) | Default, hover, focus, pending, disabled            |
| Field (input, textarea, select)           | Default, focus, invalid with message, disabled      |
| Radio card, checkbox                      | Unchecked, checked, focus                           |
| Tabs                                      | Selected, focus                                     |
| Chip filter, switch                       | Pressed, unpressed, focus                           |
| Reaction toggle                           | Pressed, unpressed, count change, rollback on error |
| Mood mark                                 | Eight moods                                         |
| Folded letter                             | Folded, unfolded                                    |
| Sealed letter                             | Sealed, opening, open, error                        |
| Inked phrase                              | Inked, lifted                                       |
| Choice list                               | Default, hover, focus, saving                       |
| Thread                                    | Steps, untaken marks, current, ending               |
| Ending map (optional)                     | Found, undiscovered, current                        |
| Validation panel                          | Problems, ready                                     |
| Dialog and sheet                          | Open, focus trapped, closing                        |
| Toast                                     | Visible, dismissed                                  |
| Status line                               | Saving, saved, failed                               |
| Skeleton                                  | Wall slip, list row                                 |
| Empty state                               | Per context, with one action                        |
| Page state                                | Not found, error with reference                     |

## Interaction and accessibility rules

Target is WCAG 2.2 AA. These are implementation acceptance criteria; none is verified until it passes in the running application by its stated method (docs/testing/strategy.md).

- Focus is always visible: 2 px accent outline, 3 px offset.
- Dialogs trap focus, open on the least destructive action, close on Escape and return focus to the control that opened them. On mobile they become sheets with the same behaviour.
- After a route change focus moves to the page heading; after a reader choice, to the new scene heading; after a failed submission, to the first invalid field.
- Toggles use aria-pressed, disclosures aria-expanded, tabs the tab pattern with arrow keys.
- Status regions announce autosave, availability checks, publishing and opening; alerts announce failures only.
- Keyboard shortcuts exist only in the reader: number keys 1 to 4 choose.
- Destructive actions are named in full and use danger colour plus text; account deletion requires typing the pen name.
- Pending buttons keep their size, describe the work ("Releasing", "Publishing") and are disabled until the server responds.
- Hidden, deleted and nonexistent content share one not-found page.
- No action requires hover, a gesture or a long press. Input text is at least 16 px.

## Implementation status

Milestone 1 implements the design system and the four signature experiences as demonstrations with fictional content. Primitives are in src/shared/ui; signature components are in src/modules/home, src/modules/confessions and src/modules/reading. The specimen page is at /design.

Implemented components: Button (four variants, two sizes, pending), Field (input and textarea with label, help and error), native select, Radio card, checkbox, Mood mark and mood rule, Folded letter, Sealed letter, Inked phrase, demonstration Reaction toggle, Choice list, Thread, Endings found, Dialog (a bottom sheet below 640 px), Status line, Error notice, Skeleton, Empty state, not-found page and error page with a reference.

Archival metadata implemented: the catalogue mark on every letter and the printed as line under the composer preview. The receive checklist belongs to onboarding (Milestone 2).

Known differences from the approved canvas and this file, to be resolved in the milestone named:

- Not built yet: Tabs and Switch (Milestone 2, account settings), Chip filter (Milestone 6, Library), Validation panel (Milestone 5), Toast (Milestone 3), the optional ending map (Milestone 6).
- The specimen page shows the Ink theme only. The Parchment theme is implemented and shown in the reader; a Parchment specimen follows with the next theme work.
- On mobile the Thread is a disclosure below the scene, open by default, instead of a strip under the header.
- Primary navigation reads The Wall, Read a story and Write. The Library replaces Read a story in Milestone 6.
- Reactions, sealed reveals, the reader thread and the composer are not saved. Each screen says so. Autosave and the idempotency key arrive with persistence in Milestone 3.

## Voice

Plain, calm and specific: what happened and what to do next. Never "try later" without saying when. No promise of absolute anonymity.
