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
  return err === InterruptedPrompt.EVENT_INTERRUPTED
}

export const allChordTypes = ChordType.all()
  .map((c) => c.name)
  .filter((name) => name !== "") // some of the chords don't have names ???
  .sort();

export const allScaleTypes = ScaleType.all()
  .map((s) => s.name)
  .sort();
 
export type baseNote = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type baseNoteLimitSingleAccidental = `${baseNote}b` | baseNote | `${baseNote}#`
export type noteVariant = `${baseNote}bb` | `${baseNote}b` | baseNote | `${baseNote}#` | `${baseNote}##`

const baseNotes : baseNote[] = ["C", "D", "E", "F", "G", "A", "B"];

declare global {
  interface Array<T> {
    commaSequence(): string;
    shuffleArray(): Array<T>;
    randomItem(): T;
  }
}

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
  const randomIndex = getRandomIndex(this);
  return this[randomIndex];
};

export function getScale(scaleTonic: baseNoteLimitSingleAccidental, scaleType: string) {
  return ScaleClass.get(scaleTonic + " " + scaleType);
}

export function getChord(chordTonic: baseNoteLimitSingleAccidental, chordType: string) {
  return ChordClass.get(chordTonic + " " + chordType);
}

export function getRandomNoteLimitSingleAccidental(): baseNoteLimitSingleAccidental {
  const baseNote = baseNotes.randomItem();
  const notesSingleAccidental = getNotesLimitSingleAccidentals(baseNote);
  return notesSingleAccidental.randomItem();
}

export function getRandomIndex<T>(arr: T[]) {
  return Math.floor(Math.random() * arr.length);
}

function getNotesLimitSingleAccidentals(note: baseNote): [`${baseNote}b`, baseNote, `${baseNote}#`] {
  const noteVariants = getNoteVariants(note);
  const [_, second, third, fourth] = noteVariants
  return [second, third, fourth]
}

export function getChromaticScaleNotes(scale: Scale): baseNoteLimitSingleAccidental[] {
  console.log(scale)
    if (scale.type !== "chromatic") {
      LogError("only a chromatic scale can be passed as argument");
    }
    return scale.notes as baseNoteLimitSingleAccidental[];
}

export function getScaleNotes(scale: Scale): noteVariant[] {
  return scale.notes as noteVariant[];
}

export function variantToBase(note:  noteVariant): baseNote {
  return note.substring(0, 1) as baseNote;
}

export function getScaleNoteAtIndex(scale: Scale, index: number): noteVariant {
  return scale.notes[index] as noteVariant;
}

export function eventByProbability(chance: number) {
  return Math.random()* 100 < chance;
}

export function transposeToAscending(n: string, index: number, arr: string[]) {
  if (index === 0) return n;
  const getInterval = Interval.distance(arr[0], n);
  const intervalData = Interval.get(getInterval);
  return intervalData.dir! < 0 ? Note.transpose(n, "8P"): n
}

export function getNoteVariants(baseNote: baseNote): [`${baseNote}bb`, `${baseNote}b`, baseNote, `${baseNote}#`, `${baseNote}##`] {
  return [
    Note.transpose(baseNote, "1dd") as `${baseNote}bb`,
    Note.transpose(baseNote, "1d") as `${baseNote}b`,
    baseNote as baseNote,
    Note.transpose(baseNote, "1A") as  `${baseNote}#`,
    Note.transpose(baseNote, "1AA") as `${baseNote}##`
  ];
}

export function numberToDegree(n: number) {
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
