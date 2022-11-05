import { Note, ScaleType } from "@tonaljs/tonal";
import chalk from "chalk";
import rs from "readline-sync";
import { isDev } from "./dev-utils";
import { Quiz } from "./quiz-types";

export class Log {
    static clear() {
      if (!isDev()) {
        console.clear();
      }
    }
    static write(content: string) {
      console.log(content);
    }
  
    static error(content: string) {
      this.write(chalk.red(content));
    }
  }

export const allScaleTypes = ScaleType.all()
  .map((s) => s.name)
  .sort();

const baseNotes = ["C", "D", "E", "F", "G", "A", "B"];

export function getRandomNote() {
  const baseNote = getRandomItem(baseNotes);
  const notesSingleAccidental = getNotesSingleAccidentals(baseNote);
  return getRandomItem(notesSingleAccidental);
}

export function getRandomItem(arr: string[]) {
  const randomIndex = getRandomIndex(arr);
  return arr[randomIndex];
}

export function getRandomIndex(arr: string[]) {
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

export function loopQuiz(QuizClass: Quiz, options: string[]) {
  let index = 0;

  while (index != -1) {
    Log.clear();
    const quiz = new QuizClass(options);

    for (const head of quiz.quizHead) {
      Log.write(head);
    }

    index = rs.keyInSelect(quiz.questionOptions, quiz.question);

    if (index === -1) {
      Log.write("Bye for now");
      break;
    }

    if (quiz.questionOptions[index] === quiz.answer) {
      Log.write(chalk.green(`Right!`));
    } else if (index != -1) {
      Log.write(chalk.red(`Wrong! Don't guess`));
      Log.write(chalk.white(`Correct : ${quiz.answer}`));
    }
    rs.question("Hit Enter key to continue", { hideEchoBack: true, mask: "" });
  }
}
