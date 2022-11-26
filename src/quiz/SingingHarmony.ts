import { INotePlay } from "../midiplay";
import { IQuiz, Quiz } from "../quiz-types";
import {
  noteSingleAccidental,
  octave,
  toOctave,
  note_transpose,
  remove_roman_numeral_position,
  Progression,
  romanNumeralsDict,
  progressions,
} from "../utils";
import { SingingQuizBase } from "./quizBase/SingingQuizBase";


export const SingingHarmony: Quiz<Progression> = class extends SingingQuizBase<Progression> implements IQuiz {
  verifyOptions(_: Progression[]): boolean {
    return true;
  }

  key: noteSingleAccidental;
  octaves: octave[] = ["3", "4", "5"];
  audio;
  randomProgression;
  constructor(progressions: Readonly<Progression[]>) {
    super(progressions);
    this.key = "C";
    this.randomProgression = progressions.randomItem();

    this.audio = this.randomProgression.chords.map(c => {
      return romanNumeralsDict[c]
    })

  }

  get quizHead() {
    return ["Progression: " + this.randomProgression.chords.map(remove_roman_numeral_position).join(", ")];
  }

  get question() {
    return "";
  }

  getAudio() {
    const audio = this.audio.map((n): INotePlay => {
      return { noteNames: n, duration: 2 };
    });

    const sequentialAudio = this.audio.flatMap(n => n).map((n): INotePlay => {
      return { noteNames: [n], duration: 1 };
    });

    const sequentialAlternatingDirectionAudio = this.audio.flatMap((n, i) => i % 2 !== 0 ? n.slice(0).reverse() : n).map((n): INotePlay => {
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
      { audio: sequentialAudio, keyboardKey: "a", onInit: false, channel: 2, message: "play progression arpeggiated" },
      { audio: sequentialAlternatingDirectionAudio, keyboardKey: "s", onInit: false, channel: 3, message: "play progression arpeggiated alternating directions" },
      { audio: keyAudio, keyboardKey: "l", onInit: false, channel: 4, message: "play key" },
    ];
  }

  static meta() {
    return {
      get getAllOptions() {
        return progressions
      },
      name: "Sing harmonic progressions",
      description: "Sing the harmonic progression as solfege",
    };
  }
};
