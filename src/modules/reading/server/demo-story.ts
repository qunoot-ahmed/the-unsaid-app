// Fictional demonstration story for Milestone 1, held on the server only.
// Replaced by published story versions in Milestones 5 and 6.
import type { StoryGraph } from "../domain/reader-view";

export const DEMO_STORY: StoryGraph = {
  slug: "the-letter-at-number-nine",
  title: "The Letter at Number Nine",
  startKey: "envelope",
  prelude: [
    { label: "Answered the door to the courier", chapter: "Chapter One", untaken: 1 },
    { label: "Kept the brass key", chapter: "Chapter Two", untaken: 2 },
  ],
  scenes: {
    envelope: {
      key: "envelope",
      chapter: "Chapter Three",
      title: "The Envelope",
      prompt: "What does Mara do?",
      paragraphs: [
        "The envelope was waiting on the mat when Mara came home, although the door had been locked all day and the letterbox was nailed shut years ago. Her name ran across the front in a hand she recognised and could not place, the ink gone brown at the edges like something left too long in the sun.",
        "She carried it into the kitchen and set it on the table between the salt cellar and the unpaid gas bill. The paper was heavy, almost cloth. On the back, pressed into a seal of dark wax, was the number nine.",
        "Downstairs, Mr. Hale's radio went quiet. In thirty years of living below her he had never once turned it off before midnight.",
        "Mara pressed her palm flat against the envelope. It was warm.",
      ],
      choices: [
        { id: "open", label: "Open the letter", to: "letter" },
        { id: "burn", label: "Burn it in the grate", to: "ash" },
        { id: "hale", label: "Take it down to Mr. Hale", to: "downstairs" },
      ],
    },
    letter: {
      key: "letter",
      chapter: "Chapter Four",
      title: "What the Letter Said",
      prompt: "Where does the list lead her?",
      paragraphs: [
        "Inside was a single sheet: a list of dates going back more than a century, each one crossed out except the last. The last one was tomorrow.",
        "Beneath it, an address on the far side of the river, and a time. Nine o'clock.",
      ],
      choices: [
        { id: "go", label: "Go to the address on the last date", to: "appointment" },
        { id: "hide", label: "Hide the letter under the floorboards", to: "tenant" },
      ],
    },
    ash: {
      key: "ash",
      chapter: "Chapter Four",
      title: "Ash",
      prompt: "What does Mara do with what is left?",
      paragraphs: [
        "The paper refused to catch at first. When it did, the flames burned a cold, careful green, and Mara was sure she saw words rising with the smoke.",
        "When the fire died, the ash kept the shape of the envelope, and a faint warmth that would not fade.",
      ],
      choices: [
        { id: "jar", label: "Sweep the ash into a jar", to: "smoke" },
        { id: "knock", label: "Knock on Mr. Hale's door", to: "tenant" },
      ],
    },
    downstairs: {
      key: "downstairs",
      chapter: "Chapter Four",
      title: "The Man Downstairs",
      prompt: "What does she do?",
      paragraphs: [
        "Mr. Hale opened his door before she knocked. On his kitchen table lay an envelope exactly like hers, addressed to him in the same brown ink.",
      ],
      choices: [
        { id: "ask", label: "Ask him who sent it", to: "nine" },
        { id: "leave", label: "Leave without a word", to: "tenant" },
      ],
    },
    appointment: {
      key: "appointment",
      chapter: null,
      title: "The Appointment",
      endingTitle: "The Appointment",
      paragraphs: [
        "At nine o'clock the house across the river was dark, but the door stood open, and someone had set two cups on the table. One of them was still warm.",
      ],
      choices: [],
    },
    tenant: {
      key: "tenant",
      chapter: null,
      title: "The Quiet Tenant",
      endingTitle: "The Quiet Tenant",
      paragraphs: [
        "Mara kept her silence, and the letters kept coming, one each year, never opened. The building grew quieter around her, until she could no longer say which voices downstairs had been real.",
      ],
      choices: [],
    },
    smoke: {
      key: "smoke",
      chapter: null,
      title: "What the Smoke Said",
      endingTitle: "What the Smoke Said",
      paragraphs: [
        "She sealed the ash in a jar on the windowsill. On clear nights it glows faintly, and if she listens closely, it speaks in her mother's voice.",
      ],
      choices: [],
    },
    nine: {
      key: "nine",
      chapter: null,
      title: "Number Nine",
      endingTitle: "Number Nine",
      paragraphs: [
        "“Your mother sent the first one,” Mr. Hale said. “Forty years ago, to me.” He slid his own envelope across the table. “This one is yours to send.”",
      ],
      choices: [],
    },
  },
};
