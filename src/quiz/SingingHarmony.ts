import { Chord, Interval, Note } from "@tonaljs/tonal";
import chalk from "chalk";
import { romanNumeralChord, progressions, Progression } from "../harmonicProgressions";
import { INotePlay } from "../midiplay";
import { IQuiz, Quiz } from "../quiz-types";
import {
  noteSingleAccidental,
  toOctave,
  note_transpose,
  random_note_single_accidental,
  noteAllAccidentalOctave,
} from "../utils";
import { SingingQuizBase } from "./quizBase/SingingQuizBase";

export const SingingHarmony: Quiz<Progression> = class extends SingingQuizBase<Progression> implements IQuiz {
  verifyOptions(_: Progression[]): boolean {
    return true;
  }

  key: noteSingleAccidental;
  tempo = 500;
  chords;
  randomProgressionInC;
  randomProgressionInKey;
  progressionTags;
  progressionDescription;
  progressionIsDiatonic;
  progressionIsMajor;
  constructor(progressions: Readonly<Progression[]>) {
    super(progressions);
    this.key = this.key = random_note_single_accidental();
    const randomProgression = progressions.randomItem();
    this.progressionTags = randomProgression.tags;
    this.progressionDescription = randomProgression.description;
    this.progressionIsDiatonic = randomProgression.isDiatonic;
    this.progressionIsMajor = randomProgression.isMajor;

    this.randomProgressionInC = {
      chords: randomProgression.chords.map((c) => romanNumeralChord(c)),
      bass: randomProgression.bass,
    };

    this.randomProgressionInKey = this.transposeProgression();

    this.chords = this.randomProgressionInKey.chords.map((n, index: number) => {
      return Chord.detect([this.randomProgressionInKey.bass[index], ...n]);
    });
  }
  // refactor me!
  private transposeProgression(): { chords: noteAllAccidentalOctave[][]; bass: noteAllAccidentalOctave[] } {
    const distanceToKey = Interval.distance("C", this.key);
    const transposed = {
      chords: this.randomProgressionInC.chords.map((c) =>
        c.map(Note.transposeBy(distanceToKey))
      ) as noteAllAccidentalOctave[][],
      bass: this.randomProgressionInC.bass.map(Note.transposeBy(distanceToKey)) as noteAllAccidentalOctave[],
    };
    const notesSorted = Note.sortedNames(transposed.chords.flatMap((n) => n));
    const lowestNote = notesSorted[0];
    const highestNote = notesSorted[notesSorted.length - 1];
    if (Note.sortedNames(["C4", lowestNote])[0] === lowestNote) {
      return {
        chords: transposed.chords.map((c) => c.map(Note.transposeBy("8P"))) as noteAllAccidentalOctave[][],
        bass: transposed.bass.map(Note.transposeBy("8P")) as noteAllAccidentalOctave[],
      };
    }
    if (Note.sortedNames(["G5", highestNote])[1] === highestNote) {
      return {
        chords: transposed.chords.map((c) => c.map(Note.transposeBy("-8P"))) as noteAllAccidentalOctave[][],
        bass: transposed.bass.map(Note.transposeBy("-8P")) as noteAllAccidentalOctave[],
      };
    }
    return transposed;
  }

  get quizHead() {
    const description = this.progressionDescription
      ? `Description: ${chalk.underline(this.progressionDescription)}`
      : "";
    const identifiers = this.progressionTags ? `Identifiers: ${chalk.underline(this.progressionTags.join(", "))}` : "";
    return [
      `${description} ${identifiers}`,
      `${this.progressionIsMajor ? chalk.underline("Major") : chalk.underline("Minor")} ${
        this.progressionIsDiatonic ? chalk.underline("Diatonic") : chalk.underline("Non-diationic")
      } progression in key of ${chalk.underline(this.key)}\n${this.chords.map((c) => c[0]).join(", ")}`,
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
