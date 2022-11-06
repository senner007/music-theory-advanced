import { Scale as ScaleClass } from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
import { getRandomItem, getNoteVariants, getRandomNote, allScaleTypes } from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import { QuizBase } from "../quizBase";

class MissingScaleNote extends QuizBase implements IQuiz {
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
      .reduce((acc, cur) => acc + cur + " ", "")

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
}

export const MissingScaleNoteQuiz: Quiz = MissingScaleNote;
