import chalk from "chalk";
import { IQuiz, Quiz } from "../quiz-types";
import { QuizBase } from "../quizBase";
import { allScaleTypes, getRandomNoteLimitSingleAccidental, getRandomIndex, numberToDegree, getNoteVariants, getScale, variantToBase, getScaleNoteAtIndex } from "../utils";

export const NameScaleDegree: Quiz<IQuiz> = class extends QuizBase implements IQuiz {
  verifyOptions(scaleTypes: string[]): boolean {
    return scaleTypes.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  scale;
  randomDegree;
  randomNote;
  randomNoteVariants;
  constructor(scaleTypes: string[]) {
    super(scaleTypes);
    this.scale = getScale(getRandomNoteLimitSingleAccidental(), scaleTypes.randomItem());
    const randomIndex = getRandomIndex(this.scale.notes);
    this.randomNote = getScaleNoteAtIndex(this.scale, randomIndex);
    this.randomDegree = numberToDegree(randomIndex);
    this.randomNoteVariants = getNoteVariants(variantToBase(this.randomNote));
  }
  get quizHead() {
    const degreeName = `${this.randomDegree} degree`;
    return [`The ${chalk.underline(degreeName)} in ${this.scale.name}`];
   
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
      name: "Name the scale degree note",
      description: "Choose the correct note name for the scale degree",
    };
  }
};
