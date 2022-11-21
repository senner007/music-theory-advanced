import { get_random_note_limit_single_accidental, transpose_to_ascending } from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import { AudioQuizBase } from "./quizBase/audioQuizBase";
import { getPattern, getPatternIntervals, getPitchPatternInversions, pitchPatternName, pitchPatterns } from "../pitchPatterns";

const pitchPatternNameArray: pitchPatternName[] = Object.keys(pitchPatterns) as pitchPatternName[];

export const HearTrichordPitchPatterns: Quiz<pitchPatternName> = class extends AudioQuizBase implements IQuiz {
  verifyOptions(selectPitchPatterns: pitchPatternName[]): boolean {
    return selectPitchPatterns.every((pattern) => pitchPatternNameArray.includes(pattern));
  }

  randomNote;
  randomPitchPattern;
  randomPatternName;
  audio;
  constructor(pitchPatterns: Readonly<pitchPatternName[]>) {
    super(pitchPatterns);
    this.randomNote = get_random_note_limit_single_accidental();
    this.randomPatternName = pitchPatterns.randomItem();
    this.randomPitchPattern = getPattern(this.randomPatternName);
    this.audio = this.prepareAudio();
  }

  private prepareAudio() {
    const pitchIntervals = getPatternIntervals(this.randomPitchPattern);
    const patternInversions = getPitchPatternInversions(this.randomNote, pitchIntervals).randomItem();
    // @ts-ignore
    const patternInversAudio = patternInversions
    .toOctave(4)
    .map(transpose_to_ascending);

    return [{ noteNames: ["A4"], duration: 3000 } ];
  }

  private getPatternDescription(p : pitchPatternName) {
    return p + " - " + pitchPatterns[p].toString();
  }

  get quizHead() {
    return [];
  }
  get questionOptions() {
    return pitchPatternNameArray.map(this.getPatternDescription)
  }
  get question() {
    return "Which pitch pattern?";
  }
  answer(guess: string): [boolean, string] {
    return [this.getPatternDescription(this.randomPatternName) === guess, this.getPatternDescription(this.randomPatternName)];
  }

  getAudio() {
    return [{ audio: this.audio, audioHandler: "space", onInit: true }];
  }

  static meta() {
    return {
      get getAllOptions() {
        return pitchPatternNameArray;
      },
      name: "Hear trichord pitch patterns",
      description: "Identify the trichord pitch pattern that is being played",
    };
  }
};
