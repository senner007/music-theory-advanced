import { Scale } from "@tonaljs/scale";
import { getNoteVariants, getRandomNote, allScaleTypes, getScale } from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import { QuizBase } from "../quizBase";

export const MissingScaleNote: Quiz<IQuiz> = class extends QuizBase implements IQuiz {
  verifyOptions(scaleTypes: string[]): boolean {
    return scaleTypes.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  scale: Scale;
  scaleMissingNote: string;
  randomNote: string;
  randomNoteVariants: string[];
  constructor(scaleTypes: string[]) {
    super(scaleTypes);

    this.scale = getScale(getRandomNote(), scaleTypes.randomItem());
    this.randomNote = this.scale.notes.randomItem();

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
  answer(guess: string): [boolean, string] {
    return [this.randomNote === guess, this.randomNote];
  }

  static get meta() {
    return {
      get getAllOptions() {
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
      },
      name: "Name the missing scale note",
      description: "Choose the correct name for the missing scale note",
    };
  }
};
