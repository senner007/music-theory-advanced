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

export type octave = "2" | "3" | "4" | "5";
export type baseNote = Readonly<"C" | "D" | "E" | "F" | "G" | "A" | "B">;
export type noteSingleAccidental = `${baseNote}b` | baseNote | `${baseNote}#`;
export type noteAllAccidental = Readonly<`${baseNote}bb` | `${baseNote}##` | noteSingleAccidental>;
export type noteAllAccidentalOctave = Readonly<`${noteAllAccidental}${octave}`>;

const baseNotes: readonly baseNote[] = Object.freeze(["C", "D", "E", "F", "G", "A", "B"]);

declare global {
  interface Array<T> {
    commaSequence(): string;
    shuffleArray(): Readonly<Array<T>>;
    randomItem(): Readonly<T>;
  }

  interface Array<T extends noteAllAccidentalOctave> {
    toOctave(octave: octave): Readonly<Array<noteAllAccidentalOctave>>;
  }

  interface ReadonlyArray<T extends noteAllAccidentalOctave> {
    toOctave(octave: octave): Readonly<Array<noteAllAccidentalOctave>>;
  }

  interface ReadonlyArray<T> {
    shuffleArray(): Readonly<Array<T>>;
    randomItem(): Readonly<T>;
    commaSequence(): string;
  }
}

export function isTooLow(n : noteAllAccidentalOctave) {
  return Note.sortedNames([n, "F3"])[0] === n;
}

export function isTooHight(n : noteAllAccidentalOctave) {
  return Note.sortedNames([n, "G5"])[1] === n;
}


export function toOctave<T extends Readonly<noteAllAccidental>>(n: T , octave : octave) {
  return (n + octave) as noteAllAccidentalOctave
}

Array.prototype.toOctave = function<T extends Readonly<noteAllAccidental>>(
  this: T[],
  octave: octave
): Readonly<noteAllAccidentalOctave[]> {
  return this.map((n) => toOctave(n, octave));
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
  const randomIndex = random_index(this);
  return this[randomIndex];
};

export function add_octave_note(notes: readonly noteAllAccidentalOctave[]): readonly noteAllAccidentalOctave[] {
  return [...notes, Note.transpose(notes[0], "8P") as noteAllAccidentalOctave];
}

export function create_scale(scaleTonic: noteSingleAccidental, scaleType: string): Scale {
  return ScaleClass.get(scaleTonic + " " + scaleType);
}

export function create_chord(chordTonic: noteSingleAccidental, chordType: string) {
  return ChordClass.get(chordTonic + " " + chordType);
}

export function random_note_single_accidental() {

  function note_single_accidentals(note: baseNote) {
    const noteVariants = note_variants(note);
    const [_, second, third, fourth] = noteVariants;
    return [second, third, fourth] as Readonly<[`${baseNote}b`, baseNote, `${baseNote}#`]>;
  }

  const baseNote = baseNotes.randomItem();
  const notesSingleAccidental = note_single_accidentals(baseNote);
  return notesSingleAccidental.randomItem() as Readonly<noteSingleAccidental>;
}

export function random_index<T>(arr: T[]) {
  return Math.floor(Math.random() * arr.length);
}

export function base_notes() {
  return baseNotes.slice(0); // refactor with class an private basenotes
}

export function chromatic_scale_notes(scale: Scale) {
  if (scale.type !== "chromatic" || !scale.tonic || !baseNotes.includes(scale.tonic as baseNote)) {
    LogError("only a chromatic scale with a basenote tonic can be passed as argument");
  }
  return scale.notes as Readonly<noteSingleAccidental[]>;
}

export function scale_notes(scale: Scale) {
  return scale.notes as Readonly<noteAllAccidental[]>;
}

export function variant_to_base(note: noteAllAccidental) {
  return note.substring(0, 1) as Readonly<baseNote>;
}

export function scale_note_at_index(scale: Scale, index: number) {
  return scale.notes[index] as Readonly<noteAllAccidental>;
}

export function event_by_probability(chance: number) {
  return Math.random() * 100 < chance;
}

export function transpose_to_ascending(n: Readonly<noteAllAccidentalOctave>, index: number, arr: readonly noteAllAccidentalOctave[]) {
  if (index === 0) return n;
  const getInterval = Interval.distance(arr[0], n);
  const intervalData = Interval.get(getInterval);
  return (intervalData.dir! < 0 ? Note.transpose(n, "8P") : n) as Readonly<noteAllAccidentalOctave>;
}

export function note_variants(
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
