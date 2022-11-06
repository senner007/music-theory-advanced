import { Scale as ScaleClass } from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
import { getRandomItem, getNoteVariants, getRandomNote, allScaleTypes } from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import { QuizBase } from "../quizBase";

export const MissingScaleNote: Quiz = class extends QuizBase implements IQuiz {
  verifyOptions(scaleTypes: string[]): boolean {
    return scaleTypes.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  scale: Scale;
  scaleMissingNote: string;
  randomNote: string;
  randomNoteVariants: string[];
  constructor(scaleTypes: string[]) {
    super(scaleTypes);

    this.scale = ScaleClass.get(getRandomNote() + " " + getRandomItem(scaleTypes));
    this.randomNote = getRandomItem(this.scale.notes);

    this.scaleMissingNote = this.scale.notes
      .map((n) => (n === this.randomNote ? "- MISSING -" : n))
      .reduce((acc, cur) => acc + cur + " ", "");

    this.randomNoteVariants = getNoteVariants(this.randomNote);
  }

  get quizHead() {
    return [this.scale.name, this.scaleMissingNote];
  }
  get questionOptions() {
    return this.randomNoteVariants;
  }
  get question() {
    return "Which note is missing?";
  }
  get answer() {
    return this.randomNote;
  }

  static getAllOptions() {
    return [
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
  }

  static quizName = "Missing scale note";
  static description = "Choose the correct scale note name missing from the scale in question";
};
