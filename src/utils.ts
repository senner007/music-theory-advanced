import { Note, ScaleType, ChordType, Interval } from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
import { Scale as ScaleClass } from "@tonaljs/tonal";
import { Chord as ChordClass } from "@tonaljs/tonal";
import { Log } from "./logger/logSync";
import { LogError } from "./dev-utils";
import { MathFloor } from "./random-funcs";
import { IntervalDistance } from "./harmonicProgressions";

export function customExit() {
  Log.clear();
  Log.write("Bye for now");
  process.exit();
}

export function isInterrupt(err: unknown) {
  return err === InterruptedPrompt.EVENT_INTERRUPTED;
}

export const allChordTypes = ChordType.all()
  .map((c: any) => c.name)
  .filter((name: any) => name !== "") // some of the chords don't have names ???
  .sort();

export const allScaleTypes = ScaleType.all()
  .map((s) => s.name)
  .sort();

const baseNotes = ["C", "D", "E", "F", "G", "A", "B"] as const;
export type baseNote = typeof baseNotes[number];
export type octave = "2" | "3" | "4" | "5";
export type noteSingleAccidental = Readonly<`${baseNote}b` | baseNote | `${baseNote}#`>;
export type noteSingleAccidentalOctave = Readonly<`${noteSingleAccidental}${octave}`>;
export type noteAllAccidental = Readonly<`${baseNote}bb` | `${baseNote}##` | "F###" | noteSingleAccidental>;
export type noteAllAccidentalOctave = Readonly<`${noteAllAccidental}${octave}`>;



declare global {


  interface Array<T> {
    toOctave(this: noteAllAccidental[], octave: octave): Readonly<Array<noteAllAccidentalOctave>>;
    transposeBy<U extends noteAllAccidental[] | noteAllAccidentalOctave[]>(this: U, interval: string): Readonly<U>;
    commaSequence(): string;
    shuffleArray(): Readonly<Array<T>>;
    randomItem(): Readonly<T>;
  }
  interface ReadonlyArray<T> {
    shuffleArray(): Readonly<Array<T>>;
    randomItem(): Readonly<T>;
    commaSequence(): string;
    toOctave(this: Readonly<noteAllAccidental[]>, octave: octave): Readonly<Array<noteAllAccidentalOctave>>;
    transposeBy<U extends Readonly<noteAllAccidental[]> | Readonly<noteAllAccidentalOctave[]>>(this: U, interval: string): Readonly<U>;
  }
}


export function ObjectKeys<Obj extends {}>(obj: Obj): (keyof Obj)[] {
  return Object.keys(obj) as (keyof Obj)[];
}

export function isTooLow(n: noteAllAccidentalOctave) {
  return Note.sortedNames([n, "F3"])[0] === n;
}

export function isTooHigh(n: noteAllAccidentalOctave) {
  return Note.sortedNames([n, "G5"])[1] === n;
}

export function toOctave<T extends Readonly<noteAllAccidental>>(n: T, octave: octave) {
  return (n + octave) as noteAllAccidentalOctave;
}

Array.prototype.transposeBy = function<U extends noteAllAccidental[] | noteAllAccidentalOctave[]> (
  this: U,
  interval: string
) : Readonly<U> {
  return this.map(n => note_transpose(n, interval)) as Readonly<U>;
};


Array.prototype.toOctave = function (
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
    const j = MathFloor(Math.random() * (i + 1));
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
  return [...notes, Note.transpose(notes[0], IntervalDistance.OctaveUp) as noteAllAccidentalOctave];
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

export function base_notes() {
  return baseNotes.slice(0); // refactor with class an private basenotes
}

export function random_index<T>(arr: T[]) {
  return MathFloor(Math.random() * arr.length);
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
  return MathFloor(Math.random() * 100) < chance;
}

export function transpose_to_ascending(
  n: Readonly<noteAllAccidentalOctave>,
  index: number,
  arr: readonly noteAllAccidentalOctave[]
) {
  if (index === 0) return n;
  const getInterval = Interval.distance(arr[0], n);
  const intervalData = Interval.get(getInterval);
  return (intervalData.dir! < 0 ? Note.transpose(n, IntervalDistance.OctaveUp) : n) as Readonly<noteAllAccidentalOctave>;
}

type NoteVariants = [`${baseNote}bb`, `${baseNote}b`, baseNote, `${baseNote}#`, `${baseNote}##`]

export function note_variants(
  baseNote: baseNote
): Readonly<NoteVariants> | Readonly<[...NoteVariants, `${baseNote}###`]> {
  const returnArray: NoteVariants = [
    Note.transpose(baseNote, "1dd") as `${baseNote}bb`,
    Note.transpose(baseNote, "1d") as `${baseNote}b`,
    baseNote as baseNote,
    Note.transpose(baseNote, "1A") as `${baseNote}#`,
    Note.transpose(baseNote, "1AA") as `${baseNote}##`,
  ];
  if (baseNote === "F") {
    return [...returnArray, Note.transpose(baseNote, "1AAA") as `${baseNote}###`] as [...NoteVariants, `${baseNote}###`];
  }
  return returnArray
}

export function note_transpose<T extends noteAllAccidental | noteAllAccidentalOctave>(note: T, interval: string): T {
  return Note.transpose(note, interval) as T;
}

export function note_transpose_by<T extends noteAllAccidental | noteAllAccidentalOctave>(
  interval: string
): (note: T) => T {
  return Note.transposeBy(interval) as unknown as (note: T) => T;
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
      break;
    default:
      LogError("Incompatible scale degree. Scale degree not in 7-note diatonic scale");
  }
  return degree;
}

("*************************************************************");
("* Test for uniqueness");
("https://ja.nsommer.dk/articles/type-checked-unique-arrays.html");

type InArray<T, X> =
  // See if X is the first element in array T
  T extends readonly [X, ...infer _Rest]
  ? true
  : // If not, is X the only element in T?
  T extends readonly [X]
  ? true
  : // No match, check if there's any elements left in T and loop recursive
  T extends readonly [infer _, ...infer Rest]
  ? InArray<Rest, X>
  : // There's nothing left in the array and we found no match
  false;

export type UniqueArray<T> = T extends readonly [infer X, ...infer Rest]
  ? // We've just extracted X from T, having Rest be the remaining values.
  // Let's see if X is in Rest, and if it is, we know we have a duplicate
  InArray<Rest, X> extends true
  ? ["Encountered value with duplicates:", X]
  : // X is not duplicated, move on to check the next value, and see
  // if that's also unique.
  readonly [X, ...UniqueArray<Rest>]
  : // T did not extend [X, ...Rest], so there's nothing to do - just return T
  T;

("*************************************************************");


