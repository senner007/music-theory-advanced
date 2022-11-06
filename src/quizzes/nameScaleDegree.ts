import { Scale as ScaleClass } from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
import { IQuiz, Quiz } from "../quiz-types";
import { QuizBase } from "../quizBase";
import { allScaleTypes, getRandomNote, getRandomItem, getRandomIndex, numberToDegree, getNoteVariants } from "../utils";

class NameScaleDegree extends QuizBase implements IQuiz {
  verifyOptions(scaleTypes: string[]): boolean {
    return scaleTypes.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  scale: Scale;
  randomDegree: string;
  randomNote: string;
  randomNoteVariants: string[];
  constructor(scaleTypes: string[]) {
    super(scaleTypes);
    this.scale = ScaleClass.get(getRandomNote() + " " + getRandomItem(scaleTypes));
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
  get answer() {
    return this.randomNote;
  }
}

export const NameScaleDegreeQuiz: Quiz = NameScaleDegree;
