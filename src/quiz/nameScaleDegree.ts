import chalk from "chalk";
import { IQuiz, Quiz } from "../quiz-types";
import { allScaleTypes, get_random_note_limit_single_accidental, getRandomIndex, numberToDegree, getNoteVariants, getScale, variantToBase, get_scale_note_at_index } from "../utils";
import { TextQuizBase } from "./quizBase/quizTextBase";

export const NameScaleDegree: Quiz = class extends TextQuizBase implements IQuiz {
  verifyOptions(scaleTypes: string[]): boolean {
    return scaleTypes.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  scale;
  randomDegree;
  randomNote;
  randomNoteVariants;
  constructor(scaleTypes: Readonly<string[]>) {
    super(scaleTypes);
    this.scale = getScale(get_random_note_limit_single_accidental(), scaleTypes.randomItem());
    const randomIndex = getRandomIndex(this.scale.notes);
    this.randomNote = get_scale_note_at_index(this.scale, randomIndex);
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

  static meta() {
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
