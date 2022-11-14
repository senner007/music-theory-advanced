import { Scale as ScaleClass } from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
import { getRandomItem, getRandomNote, allScaleTypes } from "../utils";
import { IQuiz, IQuizAudio, Quiz } from "../quiz-types";
import { QuizBase } from "../quizBase";

export const HearTetraChord: Quiz<IQuizAudio> = class extends QuizBase implements IQuiz {
  verifyOptions(scaleTypes: string[]): boolean {
    return scaleTypes.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  randomNote : string;
  randomScale: Scale;
  randomTetraChord : string[]
  scaleTetraChords : string[];

  constructor(scaleTypes: string[]) {
    super(scaleTypes);
    this.randomNote = getRandomNote();

    const scales: Scale[] = scaleTypes.map(scaleType => 
      ScaleClass.get(this.randomNote + " " + scaleType)
    );

    this.randomScale = getRandomItem(scales);
    this.randomTetraChord = this.randomScale.notes.slice(0,5);
    this.scaleTetraChords = scales.map(scale => scale.notes.slice(0,5).commaSequence())  
  }

  get quizHead() {
    return [];
  }

  get questionOptions() {
    return this.scaleTetraChords;
  }

  get question() {
    return "Which is the correct spelling?";
  }

  answer(guess: string): [boolean, string] {
    const answer = this.randomTetraChord.commaSequence();
    return [answer === guess, answer];
  }

  getAudio() {
    return this.randomTetraChord.map(note => { return { noteName: note + "4", duration: 500 } })
  }

  static get meta() {
    return {
      get getAllOptions() {
        return [
          "major",
          "aeolian",
          "phrygian",
          "lydian",
          "locrian",
        ];
      },
      name: "Hear tetrachord",
      description: "Choose the correct spelling after listening to the tetrachord in question",
    };
  }
};
