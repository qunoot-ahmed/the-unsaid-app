// Fictional demonstration letters for Milestone 1. Server code only: this file holds sealed
// bodies, which must never reach the browser except through the explicit reveal action.
// Replaced by database-backed confessions in Milestone 3.
import type { ContentNote, ReactionCounts } from "../domain/letters";
import type { MoodId } from "../domain/moods";

export interface DemoLetterRecord {
  publicId: string;
  mood: MoodId;
  day: string;
  body: string;
  sealed: ContentNote | null;
  reactions: ReactionCounts;
}

export const DEMO_LETTERS: ReadonlyArray<DemoLetterRecord> = [
  {
    publicId: "k3x9m2ql",
    reactions: { felt: 41, same: 12, holding: 6 },
    mood: "longing",
    day: "Today",
    body: "Some nights I still check whether your light is on. You moved away four years ago.",
    sealed: null,
  },
  {
    publicId: "p7r2w8vd",
    reactions: { felt: 96, same: 31, holding: 140 },
    mood: "regret",
    day: "Today",
    body: "My mother called the night before she died and I let it ring because I was tired. She left a voicemail about a recipe. I have listened to it more than two hundred times. I still have not made the soup. I think as long as I do not make it, the conversation is not over.",
    sealed: "Grief and loss",
  },
  {
    publicId: "f4n6t1zb",
    reactions: { felt: 28, same: 33, holding: 19 },
    mood: "fear",
    day: "Today",
    body: "I am thirty-four and I have never told a doctor everything. I edit my symptoms in the waiting room, every single time, because I am more afraid of the face they will make than of whatever is actually wrong.",
    sealed: null,
  },
  {
    publicId: "h8c3y5ge",
    reactions: { felt: 87, same: 4, holding: 22 },
    mood: "tenderness",
    day: "Yesterday",
    body: "My dad learned to braid hair from videos so I would not be the only girl at school without plaits. I have never thanked him for it.",
    sealed: null,
  },
  {
    publicId: "m2v7q4sa",
    reactions: { felt: 15, same: 9, holding: 11 },
    mood: "shame",
    day: "This week",
    body: "In my second year I handed in an essay that was mostly a friend's work from the year before. I changed the sentences and kept the ideas. I got the highest mark in the class and she never found out. Ten years later I teach that same course. Every September, when I explain what plagiarism is, I hear my own voice and feel like a forgery standing at the front of the room. Last year a student asked me why it mattered so much if nobody was hurt. I gave her the answer from the handbook. The real answer is that you carry it, quietly, into every room where someone trusts you, and you never quite put it down.",
    sealed: null,
  },
  {
    publicId: "w6j9d2ku",
    reactions: { felt: 212, same: 140, holding: 18 },
    mood: "anger",
    day: "This week",
    body: "I am tired of being the reasonable one.",
    sealed: null,
  },
  {
    publicId: "r5t8b3nx",
    reactions: { felt: 64, same: 7, holding: 51 },
    mood: "relief",
    day: "This week",
    body: "The test came back clear. I had already written letters to my kids, just in case. I am keeping them in the drawer anyway.",
    sealed: null,
  },
  {
    publicId: "c9e4f7lh",
    reactions: { felt: 58, same: 20, holding: 9 },
    mood: "hope",
    day: "This week",
    body: "Started piano at forty-one. My teacher is nineteen. I practise only when the house is empty, so no one hears how bad I still am.",
    sealed: null,
  },
];
