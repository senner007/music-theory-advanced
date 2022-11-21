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
  audioChord;
  audioArppeggio;
  constructor(pitchPatterns: Readonly<pitchPatternName[]>) {
    super(pitchPatterns);
    this.randomNote = get_random_note_limit_single_accidental();
    this.randomPatternName = pitchPatterns.randomItem();
    this.randomPitchPattern = getPattern(this.randomPatternName);
    const [chord, arppeggio] =  this.prepareAudio();
    this.audioChord = chord
    this.audioArppeggio = arppeggio;
  }

  private prepareAudio() {
    const pitchIntervals = getPatternIntervals(this.randomPitchPattern);
    const patternInversions = getPitchPatternInversions(this.randomNote, pitchIntervals).randomItem();
    const patternInversAudio = patternInversions
    .toOctave(4)
    .map(transpose_to_ascending);

    return [
      [{ noteNames: patternInversAudio, duration: 3000 }],

      patternInversAudio.map(a => {
        return { noteNames: [a], duration: 1000 }
      })
    ];
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
    return [
       { audio: this.audioChord, keyboardKey: "space", onInit: true, channel: 1, message : "play trichord harmonically" },
       { audio: this.audioArppeggio, keyboardKey: "l", onInit: false, channel: 2,  message : "play trichord squentially" },
      ];
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
