import { Interval } from "@tonaljs/tonal";
import chalk from "chalk";
import { progressions, Progression } from "../harmonicProgressions";
import { INotePlay } from "../midiplay";
import { IQuiz, Quiz } from "../quiz-types";
import { ITableHeader } from "../solfege";
import {
  noteSingleAccidental,
  toOctave,
  note_transpose,
  random_note_single_accidental,
} from "../utils";
import { SingingQuizBase } from "./quizBase/SingingQuizBase";


export const SingBassLines: Quiz<Progression[]> = class extends SingingQuizBase<Progression[]> {
  verifyOptions(_: Progression[]): boolean {
    return true;
  }

  randomNote: noteSingleAccidental;
  override tempo = 1000;

  randomBassLineInKey;

  progressionIsDiatonic;
  progressionIsMajor;
  constructor(progressions: Readonly<Progression[]>) {
    super(progressions);
    this.randomNote = random_note_single_accidental();
    const randomProgression = progressions.randomItem();
    this.progressionIsDiatonic = randomProgression.isDiatonic;
    this.progressionIsMajor = randomProgression.isMajor;

    const keyDistance = Interval.distance("C", this.randomNote)
    this.randomBassLineInKey = randomProgression.bass.transposeBy(keyDistance);
  }

  get quizHead() {
    return [
      `${
        this.progressionIsDiatonic ? chalk.underline("Diatonic") : chalk.underline("Non-diationic")
      } progression bass line in key of ${chalk.underline(this.randomNote + " " + (this.progressionIsMajor ? "Major" : "Minor"))}`,
    ];
  }

  get question() {
    return "";
  }

  getAudio() {
    const bassLine = this.randomBassLineInKey.map((n): INotePlay => {
      return { noteNames: [n], duration: 1 };
    });

    const keyAudio = [
      {
        noteNames: [
          // abstract me out! // major or minor version
          toOctave(this.randomNote, "2"),
          toOctave(this.randomNote, "3"),
          toOctave(note_transpose(this.randomNote, this.progressionIsMajor ? "3M" : "3m"), "3"),
          toOctave(note_transpose(this.randomNote, "P5"), "3"),
        ],
        duration: 2,
      } as INotePlay,
    ];

    return [
      { audio: bassLine, keyboardKey: "space", onInit: false, channel: 1, message: "play bass line", display: true },
      { audio: keyAudio, keyboardKey: "l", onInit: true, channel: 2, message: "establish key" },
    ];
  }

  get tableHeader() {
    return this.randomBassLineInKey.map((_, index): ITableHeader => {
      index++;
      return { name: index.toString().padStart(2, '0'), duration: 1 };
    });
  }

  static meta() {
    return {
      get getAllOptions() {
        return progressions;
      },
      name: "Sing bass lines",
      description: "Sing the harmonic progression bass line as solfege degrees",
    };
  }
};
