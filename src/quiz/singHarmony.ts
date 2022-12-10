import { Chord, Interval, Key, Note } from "@tonaljs/tonal";
import chalk from "chalk";
import { romanNumeralChord, progressions, Progression, transposeProgression } from "../harmonicProgressions";
import { getKeyChords, keyInfo } from "../keyInfo";
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


export const SingHarmony: Quiz<Progression> = class extends SingingQuizBase<Progression> implements IQuiz {
  verifyOptions(_: Progression[]): boolean {
    return true;
  }

  key: noteSingleAccidental;
  override tempo = 1000;
  chords;
  randomProgressionInKey;
  progressionTags;
  progressionDescription;
  progressionIsDiatonic;
  progressionIsMajor;
  keyInfo;
  constructor(progressions: Readonly<Progression[]>) {
    super(progressions);
    this.key = this.key = random_note_single_accidental();

    const randomProgression = progressions.randomItem();
    this.progressionTags = randomProgression.tags;
    this.progressionDescription = randomProgression.description;
    this.progressionIsDiatonic = randomProgression.isDiatonic;
    this.progressionIsMajor = randomProgression.isMajor;
    this.keyInfo = keyInfo(this.progressionIsMajor ? Key.majorKey(this.key) : Key.minorKey(this.key));
    const randomProgressionInC = {
      chords: randomProgression.chords.map((c) => romanNumeralChord(c)),
      bass: randomProgression.bass,
    };

    this.randomProgressionInKey = transposeProgression(randomProgressionInC, this.key);

    this.chords = this.randomProgressionInKey.chords.map((n, index: number) => {
      const chords = Chord.detect([this.randomProgressionInKey.bass[index], ...n]);
      const chordsInKey = chords.filter((chord) => getKeyChords(this.keyInfo).includes(chord));
      return chordsInKey.length > 0 ? chordsInKey[0] : chords[0];

    });
  }

  get quizHead() {
    const description = this.progressionDescription
      ? `Description: ${chalk.underline(this.progressionDescription)}`
      : "";

    const chords = `${this.chords.join(", ")}`;
    const identifiers = this.progressionTags ? `Identifiers: ${chalk.underline(this.progressionTags.join(", "))}` : "";
    return [
      `${description} ${identifiers}`,
      `${
        this.progressionIsDiatonic ? chalk.underline("Diatonic") : chalk.underline("Non-diationic")
      } progression in key of ${chalk.underline(this.key + " " + (this.progressionIsMajor ? "Major" : "Minor"))}`,
      chords,
    ];
  }

  get question() {
    return "";
  }

  getAudio() {
    const audio = this.randomProgressionInKey.chords.map((n): INotePlay => {
      return { noteNames: n, duration: 2 };
    });

    const audioWithBass = this.randomProgressionInKey.chords.map((n, index): INotePlay => {
      return { noteNames: [this.randomProgressionInKey.bass[index], ...n], duration: 2 };
    });

    const sequentialAudio = this.randomProgressionInKey.chords
      .flatMap((n) => n)
      .map((n): INotePlay => {
        return { noteNames: [n], duration: 1 };
      });

    const sequentialAlternatingDirectionAudio = this.randomProgressionInKey.chords
      .flatMap((n, i) => (i % 2 !== 0 ? n.slice(0).reverse() : n))
      .map((n): INotePlay => {
        return { noteNames: [n], duration: 1 };
      });

    const keyAudio = [
      {
        noteNames: [
          // abstract me out! // major or minor version
          toOctave(this.key, "2"),
          toOctave(this.key, "3"),
          toOctave(note_transpose(this.key, this.progressionIsMajor ? "3M" : "3m"), "3"),
          toOctave(note_transpose(this.key, "P5"), "3"),
        ],
        duration: 2,
      } as INotePlay,
    ];

    return [
      { audio: audio, keyboardKey: "space", onInit: false, channel: 1, message: "play progression" },
      { audio: audioWithBass, keyboardKey: "b", onInit: false, channel: 1, message: "play progression with bass line" },
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

  get tableHeader() {
    return this.chords.map((c): ITableHeader => {
      return { name: c, duration: 2 };
    });
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
