import { Chord as ChordClass } from "@tonaljs/tonal";
import { Chord } from "@tonaljs/chord";
import { getRandomItem, getRandomNote, allChordTypes, shuffleArray } from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import { QuizBase } from "../quizBase";

class WhichIsTheChord extends QuizBase implements IQuiz {
  verifyOptions(options: string[]): boolean {
    return options.every((chordType) => allChordTypes.includes(chordType));
  }

  chord: Chord;
  chosenChordType: string;
  shuffledChordTones: string[];
  chordPossibilities = ["major", "minor", "diminished", "augmented"];
  questionOptionsArray: string[][];
  constructor(options: string[]) {
    super(options);
    this.chosenChordType = getRandomItem(options);
    this.chord = ChordClass.get(getRandomNote() + " " + this.chosenChordType);
    this.shuffledChordTones = shuffleArray(this.chord.notes);
    const remainingChordPossibilities = this.chordPossibilities.filter(
      (chordType) => chordType !== this.chosenChordType
    );
    const chordTonesOptions = remainingChordPossibilities
      .map((chordTypes) => ChordClass.get(getRandomNote() + " " + chordTypes))
      .map((chord) => shuffleArray(chord.notes));
    this.questionOptionsArray = shuffleArray([this.shuffledChordTones, ...chordTonesOptions]);
  }
  get quizHead() {
    return [`Choose the ${this.chosenChordType.toUpperCase()} chord in any inversion`];
  }
  get questionOptions() {
    return this.questionOptionsArray;
  }
  get question() {
    return `Which is correct?`;
  }
  get answer() {
    return this.shuffledChordTones;
  }
}

export const WhichIsTheChordQuiz: Quiz = WhichIsTheChord;
