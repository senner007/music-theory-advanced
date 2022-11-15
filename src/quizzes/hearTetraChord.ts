import { Scale as ScaleClass, Interval, Note  } from "@tonaljs/tonal";
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
  audio: { noteName: string; duration: number; }[]; 

  private prepareAudio() {
    function transposeToAscending(n: string, index: number, arr: string[]) {
      if (index === 0) return n;
      const getInterval = Interval.distance(arr[0], n);
      const intervalData = Interval.get(getInterval);
      return intervalData.dir! < 0 ? Note.transpose(n, "8P"): n
    }

    return this.randomTetraChord
    .map(n => n + "4")
    .map(transposeToAscending)
    .shuffleArray()
    .map(note => { return { noteName: note, duration: 500 } })
  }

  constructor(scaleTypes: string[]) {
    super(scaleTypes);
    this.randomNote = getRandomNote();

    const scales: Scale[] = scaleTypes.map(scaleType => 
      ScaleClass.get(this.randomNote + " " + scaleType)
    );

    this.randomScale = getRandomItem(scales);
    this.randomTetraChord = this.randomScale.notes.slice(0,4);
    this.scaleTetraChords = scales.map(scale => scale.notes.slice(0,4).commaSequence())  

    this.audio = this.prepareAudio();
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
    return this.audio;
  }

  static get meta() {
    return {
      get getAllOptions() {
        return [
          "major",
          "aeolian",
          "phrygian",
          "lydian",
          "altered",
        ];
      },
      name: "Hear tetrachord",
      description: "Choose the correct spelling after listening to the tetrachord",
    };
  }
};
