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
  randomScaleNotes;
  interval;
  override tempo = 1000;

  constructor(options: Readonly<optionsType>) {
    super(options);
    const [scaletypes, intervals] = options;
    this.randomNote = random_note_single_accidental();
    const randomScaleType = scaletypes.randomItem();
    const randomScale = create_scale(this.randomNote, randomScaleType);
    this.randomScaleNotes = [
      ...scale_notes(randomScale).toOctave("3").map(transpose_to_ascending),
      ...scale_notes(randomScale).toOctave("4").map(transpose_to_ascending),
    ];

    const firstNote = this.randomScaleNotes.randomItem();

    const secondTonePossibilities = this.randomScaleNotes
      .filter((n) => !(n === firstNote))
      .filter((n) => {
        const intervalDistance = getIntervalDistance(n, firstNote)
        return intervals.includes(intervalToAbsolute(intervalDistance));
      });

    const secondNote = secondTonePossibilities.randomItem();
    this.interval = [firstNote, secondNote];
  }

  get quizHead() {
    return [``];
  }

  get question() {
    return "";
  }

  getAudio() {
    const interval = this.interval.map((n): INotePlay => {
      return { noteNames: [n], duration: 1 };
    });

    const firstNote = [interval[0]];

    return [
      { audio: interval, keyboardKey: "space", onInit: false, channel: 1, message: "play interval", display: true },
      { audio: firstNote, keyboardKey: "f", onInit: true, channel: 1, message: "play fist note" },
    ];
  }

  get tableHeader() {
    return this.randomScaleNotes.map((_, index): ITableHeader => {
      index++;
      return { name: index.toString().padStart(2, "0"), duration: 1 };
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
        const intervals: intervalType[] = ["2m", "2M", "3m", "3M", "4P", "4A", "5d", "5P"];
        return [scales, intervals];
      },
      name: "Sing contextual intervals",
      description: "Sing the contextual interval",
    };
  }
};
