import chalk from "chalk";
import { IQuiz, Quiz } from "../quiz-types";
import {
  allScaleTypes,
  random_note_single_accidental,
  random_index,
  number_to_degree,
  note_variants,
  create_scale,
  variant_to_base,
  scale_note_at_index
} from "../utils";
import { TextQuizBase } from "./quizBase/textBase";

export const NameScaleDegree: Quiz<string> = class extends TextQuizBase<string> implements IQuiz {
  verifyOptions(scaleTypes: string[]): boolean {
    return scaleTypes.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  scale;
  randomDegree;
  randomNote;
  randomNoteVariants;
  constructor(scaleTypes: Readonly<string[]>) {
    super(scaleTypes);
    this.scale = create_scale(random_note_single_accidental(), scaleTypes.randomItem());
    const randomIndex = random_index(this.scale.notes);
    this.randomNote = scale_note_at_index(this.scale, randomIndex);
    this.randomDegree = number_to_degree(randomIndex);
    this.randomNoteVariants = note_variants(variant_to_base(this.randomNote));
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
  answer(): string {
    return this.randomNote;
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
