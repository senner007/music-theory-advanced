import chalk from "chalk";
import { INotePlay } from "../midiplay";
import { Quiz } from "../quiz-types";
import { ITableHeader } from "../solfege";
import { transpose_to_ascending } from "../transposition";
import {
  noteSingleAccidental,
  random_note_single_accidental,
  create_scale,
  scale_notes,
  intervalToAbsolute,
  intervalType,
  getIntervalDistance,
} from "../utils";
import { SingingQuizBase } from "./quizBase/SingingQuizBase";

type optionsType = [string[], intervalType[]]

export const SingContextualIntervals: Quiz<optionsType> = class extends SingingQuizBase<
optionsType
> {
  verifyOptions(_: optionsType): boolean {
    return true;
  }

  randomNote: noteSingleAccidental;
  randomScaleType;
  interval;
  scaleThirdOctave;
  override tempo = 500;

  constructor(options: Readonly<optionsType>) {
    super(options);
    const [scaletypes, intervals] = options;
    this.randomNote = random_note_single_accidental();
    this.randomScaleType = scaletypes.randomItem();
    const randomScale = create_scale(this.randomNote, this.randomScaleType);

    this.scaleThirdOctave = scale_notes(randomScale).toOctave("3").map(transpose_to_ascending)
    const randomScaleNotes = [
      ...this.scaleThirdOctave,
      ...scale_notes(randomScale).toOctave("4").map(transpose_to_ascending),
    ];

    const firstNote = randomScaleNotes.randomItem();

    const secondTonePossibilities = randomScaleNotes
      .filter((n) => !(n === firstNote))
      .filter((n) => {
        const intervalDistance = getIntervalDistance(n, firstNote)
        return intervals.includes(intervalToAbsolute(intervalDistance));
      });

    const secondNote = secondTonePossibilities.randomItem();
    this.interval = [firstNote, secondNote];
  }

  get quizHead() {
    return [`Identify and sing the interval from the ${this.randomScaleType} scale`];
  }

  get question() {
    return "";
  }

  getAudio() {
    const interval = this.interval.map((n): INotePlay => {
      return { noteNames: [n], duration: 2 };
    });

    const firstNote = [interval[0]];
    const secondNote = [interval[1]];

    const root : INotePlay[] = [{ noteNames: [this.scaleThirdOctave[0]], duration: 1 }];

    return [
      { audio: interval, keyboardKey: "space", onInit: false, channel: 1, message: "play interval", display: true },
      { audio: firstNote, keyboardKey: "f", onInit: true, channel: 1, message: "play the fist note" },
      { audio: secondNote, keyboardKey: "s", onInit: false, channel: 1, message: "play the second note" },
      { audio: root, keyboardKey: "r", onInit: false, channel: 1, message: "play the root of scale" },
    ];
  }

  get tableHeader() {
    return this.interval.map((_, index): ITableHeader => {
      index++;
      return { name: index.toString().padStart(2, "0"), duration: 2 };
    });
  }

  static meta() {
    return {
      get getAllOptions(): optionsType {
        const scales = [
          "major",
          "aeolian",
          "major pentatonic",
          "dorian",
          "phrygian",
          "lydian",
          "mixolydian",
          "locrian",
          "harmonic minor",
          "melodic minor",
        ];
        const intervals: intervalType[] = ["2m", "2M", "3m", "3M", "4P", "4A", "5d", "5P", "6m", "6M"];
        return [scales, intervals];
      },
      name: "Sing contextual intervals",
      description: "Sing the contextual interval",
    };
  }
};
