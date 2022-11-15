import { Note, ScaleType, ChordType } from "@tonaljs/tonal";
import chalk from "chalk";
import rs from "readline-sync";
import { isDev } from "./dev-utils";
import inquirer from "inquirer";
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
InterruptedPrompt.fromAll(inquirer);

export class Log {
  static clear() {
    if (!isDev()) {
      console.clear();
    }
  }
  static write(content: string) {
    console.log(content);
  }

  static success(content: string) {
    this.write(chalk.green(content));
  }

  static error(content: string) {
    this.write(chalk.red(content));
  }

  static keyInSelect(questionOptions: string[], question: string) {
    return rs.keyInSelect(
      questionOptions,
      question,
      { cancel: false }
    );
  }

  static continue(message: string) {
    return rs.question(message, { hideEchoBack: true, mask: "" });
  }
}

export function exit () {
  Log.write("\nBye for now");
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

const baseNotes = ["C", "D", "E", "F", "G", "A", "B"];

declare global {
  interface Array<T> {
    commaSequence(): T;
    shuffleArray(): Array<T>;
  }
}

Array.prototype.commaSequence = function intersperse() {
  return this.join(", ");
};

Array.prototype.shuffleArray = function intersperse() {
  return shuffleArray(this);
};

const shuffleArray = <T>(array: T[]) => {
  const arrayClone = [...array];
  for (let i = arrayClone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arrayClone[i];
    arrayClone[i] = arrayClone[j];
    arrayClone[j] = temp;
  }
  return arrayClone;
};

export function getRandomNote() {
  const baseNote = getRandomItem(baseNotes);
  const notesSingleAccidental = getNotesSingleAccidentals(baseNote);
  return getRandomItem(notesSingleAccidental);
}

export function getRandomItem<T>(arr: T[]) {
  const randomIndex = getRandomIndex(arr);
  return arr[randomIndex];
}

export function getRandomIndex<T>(arr: T[]) {
  return Math.floor(Math.random() * arr.length);
}

function getNotesSingleAccidentals(note: string) {
  const noteVariants = getNoteVariants(note);
  return [noteVariants[1], noteVariants[2], noteVariants[3]];
}

export function getNoteVariants(note: string) {
  const noteBase = note.substring(0, 1);
  return [
    Note.transpose(noteBase, "1dd"),
    Note.transpose(noteBase, "1d"),
    noteBase,
    Note.transpose(noteBase, "1A"),
    Note.transpose(noteBase, "1AA"),
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
