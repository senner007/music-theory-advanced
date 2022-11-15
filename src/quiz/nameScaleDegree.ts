import { Scale } from "@tonaljs/scale";
import { IQuiz, Quiz } from "../quiz-types";
import { QuizBase } from "../quizBase";
import { allScaleTypes, getRandomNote, getRandomIndex, numberToDegree, getNoteVariants, getScale } from "../utils";

export const NameScaleDegree: Quiz<IQuiz> = class extends QuizBase implements IQuiz {
  verifyOptions(scaleTypes: string[]): boolean {
    return scaleTypes.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  scale: Scale;
  randomDegree: string;
  randomNote: string;
  randomNoteVariants: string[];
  constructor(scaleTypes: string[]) {
    super(scaleTypes);
    this.scale = getScale(getRandomNote(), scaleTypes.randomItem());
    const randomIndex = getRandomIndex(this.scale.notes);
    this.randomNote = this.scale.notes[randomIndex];
    this.randomDegree = numberToDegree(randomIndex);
    this.randomNoteVariants = getNoteVariants(this.randomNote);
  }
  get quizHead() {
    const degreeName = `${this.randomDegree} degree`;
    return [this.scale.name, degreeName];
  }
  get questionOptions() {
    return this.randomNoteVariants;
  }
  get question() {
    return `Which is the degree?`;
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
          "dorian",
          "phrygian",
          "lydian",
          "mixolydian",
          "locrian",
          "harmonic minor",
          "melodic minor",
        ];
      },
      name: "Name the scale degree",
      description: "Choose the correct note name for the scale degree in question",
    };
  }
};
