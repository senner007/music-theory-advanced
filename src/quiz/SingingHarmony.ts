import chalk from "chalk";
import { INotePlay } from "../midiplay";
import { IQuiz, Quiz } from "../quiz-types";
import {
  noteSingleAccidental,
  toOctave,
  note_transpose,
  to_roman_numeral,
  Progression,
  romanNumeralChord,
  RomanNumeral,
  RomanNumeralBelow,
} from "../utils";
import { SingingQuizBase } from "./quizBase/SingingQuizBase";

type ProgressionObject = Readonly<
  {
    chords: Readonly<(RomanNumeral | RomanNumeralBelow)[]>;
    description?: string;
    isDiatonic: boolean;
  }[]
>;

export const progressions: ProgressionObject = [
  { chords: ["I", "I6", "IV", "V", "I"], isDiatonic: true },
  { chords: ["I6", "IV", "V65-u", "I"], isDiatonic: true },
  { chords: ["I", "V7-u", "I"], isDiatonic: true },
  { chords: ["I", "ii", "IV64", "V65-u"], isDiatonic: true },
  {
    chords: ["I", "V6-u", "vi-u", "iii6-u", "IV6-u", "I64-u", "IV6-u", "V6-u"],
    description: "Pachelbel canon",
    isDiatonic: true,
  },
  {
    chords: ["I", "IV64", "vii-u", "iii64-u", "vi-u", "ii64-u", "V6-u", "I"],
    description: "Circle of fifth progression",
    isDiatonic: true,
  },
] as const;

export const SingingHarmony: Quiz<Progression> = class extends SingingQuizBase<Progression> implements IQuiz {
  verifyOptions(_: Progression[]): boolean {
    return true;
  }

  key: noteSingleAccidental;
  audio;
  randomProgression;
  tempo = 500;
  constructor(progressions: Readonly<Progression[]>) {
    super(progressions);
    this.key = "C";
    this.randomProgression = progressions.randomItem();

    this.audio = this.randomProgression.chords.map((c) => romanNumeralChord(c));
  }

  get quizHead() {
    return [
      this.randomProgression.description
        ? `The progression is known as the ${chalk.underline(this.randomProgression.description)}`
        : "",
      `${
        this.randomProgression.isDiatonic ? chalk.underline("Diatonic") : chalk.underline("Non-diationic")
      } progression: ${this.randomProgression.chords.map(to_roman_numeral).join(", ")}`,
    ];
  }

  get question() {
    return "";
  }

  getAudio() {
    const audio = this.audio.map((n): INotePlay => {
      return { noteNames: n, duration: 2 };
    });

    const sequentialAudio = this.audio
      .flatMap((n) => n)
      .map((n): INotePlay => {
        return { noteNames: [n], duration: 1 };
      });

    const sequentialAlternatingDirectionAudio = this.audio
      .flatMap((n, i) => (i % 2 !== 0 ? n.slice(0).reverse() : n))
      .map((n): INotePlay => {
        return { noteNames: [n], duration: 1 };
      });

    const keyAudio = [
      {
        noteNames: [
          // abstract me out!
          toOctave(this.key, "2"),
          toOctave(this.key, "3"),
          toOctave(note_transpose(this.key, "3M"), "3"),
          toOctave(note_transpose(this.key, "P5"), "3"),
        ],
        duration: 2,
      } as INotePlay,
    ];

    return [
      { audio: audio, keyboardKey: "space", onInit: false, channel: 1, message: "play progression" },
      { audio: sequentialAudio, keyboardKey: "a", onInit: false, channel: 1, message: "arpeggiate progression" },
      {
        audio: sequentialAlternatingDirectionAudio,
        keyboardKey: "s",
        onInit: false,
        channel: 1,
        message: "arpeggiate alternating up and down",
      },
      { audio: keyAudio, keyboardKey: "l", onInit: true, channel: 2, message: "establish key" },
    ];
  }

  static meta() {
    return {
      get getAllOptions() {
        return progressions;
      },
      name: "Sing harmonic progressions",
      description: "Sing the harmonic progression as solfege degrees",
    };
  }
};
