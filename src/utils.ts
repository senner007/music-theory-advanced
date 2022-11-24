import { Note, ScaleType, ChordType, Interval } from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
import { Scale as ScaleClass } from "@tonaljs/tonal";
import { Chord as ChordClass } from "@tonaljs/tonal";
import { Log } from "./logger/logSync";
import { LogError } from "./dev-utils";

export function customExit() {
  Log.clear();
  Log.write("Bye for now");
  process.exit();
}

export function isInterrupt(err: unknown) {
  return err === InterruptedPrompt.EVENT_INTERRUPTED;
}

export const allChordTypes = ChordType.all()
  .map((c) => c.name)
  .filter((name) => name !== "") // some of the chords don't have names ???
  .sort();

export const allScaleTypes = ScaleType.all()
  .map((s) => s.name)
  .sort();

type octave = "3" | "4" | "5";
export type baseNote = Readonly<"C" | "D" | "E" | "F" | "G" | "A" | "B">;
export type baseNoteCommonAccidental = `${baseNote}b` | baseNote | `${baseNote}#`;
export type baseNoteAllAccidental = Readonly<`${baseNote}bb` | `${baseNote}b` | baseNote | `${baseNote}#` | `${baseNote}##`>;
export type baseNoteAllAccidentalOctave = Readonly<`${baseNoteAllAccidental}${octave}`>;

const baseNotes: readonly baseNote[] = Object.freeze(["C", "D", "E", "F", "G", "A", "B"]);

declare global {
  interface Array<T> {
    commaSequence(): string;
    shuffleArray(): Readonly<Array<T>>;
    randomItem(): Readonly<T>;
  }

  interface Array<T extends baseNoteAllAccidentalOctave> {
    toOctave(octave: number): Readonly<Array<baseNoteAllAccidentalOctave>>;
  }

  interface ReadonlyArray<T extends baseNoteAllAccidentalOctave> {
    toOctave(octave: number): Readonly<Array<baseNoteAllAccidentalOctave>>;
  }

  interface ReadonlyArray<T> {
    shuffleArray(): Readonly<Array<T>>;
    randomItem(): Readonly<T>;
    commaSequence(): string;
  }
}

Array.prototype.toOctave = function toOctave<T extends Readonly<baseNoteAllAccidental>>(
  this: T[],
  octave: number
): Readonly<baseNoteAllAccidentalOctave[]> {
  return this.map((n) => (n + octave) as baseNoteAllAccidentalOctave);
};

Array.prototype.commaSequence = function (): string {
  return this.join(", ");
};

Array.prototype.shuffleArray = function () {
  const arrayClone = [...this];
  for (let i = arrayClone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arrayClone[i];
    arrayClone[i] = arrayClone[j];
    arrayClone[j] = temp;
  }
  return arrayClone;
};

Array.prototype.randomItem = function () {
  const randomIndex = get_random_index(this);
  return this[randomIndex];
};

export function add_octave_note(notes: readonly baseNoteAllAccidentalOctave[]): readonly baseNoteAllAccidentalOctave[] {
  return [...notes, Note.transpose(notes[0], "8P") as baseNoteAllAccidentalOctave];
}

export function get_scale(scaleTonic: baseNoteCommonAccidental, scaleType: string): Scale {
  return ScaleClass.get(scaleTonic + " " + scaleType);
}

export function get_chord(chordTonic: baseNoteCommonAccidental, chordType: string) {
  return ChordClass.get(chordTonic + " " + chordType);
}

export function get_random_note_common_accidental() {
  const baseNote = baseNotes.randomItem();
  const notesSingleAccidental = get_notes_common_accidentals(baseNote);
  return notesSingleAccidental.randomItem() as Readonly<baseNoteCommonAccidental>;
}

export function get_random_index<T>(arr: T[]) {
  return Math.floor(Math.random() * arr.length);
}

export function get_base_notes() {
  return baseNotes.slice(0); // refactor with class an private basenotes
}

function get_notes_common_accidentals(note: baseNote) {
  const noteVariants = get_note_variants(note);
  const [_, second, third, fourth] = noteVariants;
  return [second, third, fourth] as Readonly<[`${baseNote}b`, baseNote, `${baseNote}#`]>;
}

export function get_chromatic_scale_notes(scale: Scale) {
  if (scale.type !== "chromatic" || !scale.tonic || !baseNotes.includes(scale.tonic as baseNote)) {
    LogError("only a chromatic scale with a basenote tonic can be passed as argument");
  }
  return scale.notes as Readonly<baseNoteCommonAccidental[]>;
}

export function get_scale_notes(scale: Scale) {
  return scale.notes as Readonly<baseNoteAllAccidental[]>;
}

export function variant_to_base(note: baseNoteAllAccidental) {
  return note.substring(0, 1) as Readonly<baseNote>;
}

export function get_scale_note_at_index(scale: Scale, index: number) {
  return scale.notes[index] as Readonly<baseNoteAllAccidental>;
}

export function event_by_probability(chance: number) {
  return Math.random() * 100 < chance;
}

export function transpose_to_ascending(n: Readonly<baseNoteAllAccidentalOctave>, index: number, arr: readonly baseNoteAllAccidentalOctave[]) {
  if (index === 0) return n;
  const getInterval = Interval.distance(arr[0], n);
  const intervalData = Interval.get(getInterval);
  return intervalData.dir! < 0 ? Note.transpose(n, "8P") : n;
}

export function get_note_variants(
  baseNote: baseNote
): Readonly<[`${baseNote}bb`, `${baseNote}b`, baseNote, `${baseNote}#`, `${baseNote}##`]> {
  return [
    Note.transpose(baseNote, "1dd") as `${baseNote}bb`,
    Note.transpose(baseNote, "1d") as `${baseNote}b`,
    baseNote as baseNote,
    Note.transpose(baseNote, "1A") as `${baseNote}#`,
    Note.transpose(baseNote, "1AA") as `${baseNote}##`,
  ];
}

export function number_to_degree(n: number) {
  let degree = "";
  switch (n) {
    case 0:
      degree = "1st";
      break;
    case 1:
      degree = "2nd";
      break;
    case 2:
      degree = "3rd";
      break;
    case 3:
      degree = "4th";
      break;
    case 4:
      degree = "5th";
      break;
    case 5:
      degree = "6th";
      break;
    case 6:
      degree = "7th";
  }
  return degree;
}
