import { Chord as ChordClass } from "@tonaljs/tonal";
import { getRandomItem, getRandomNote, allChordTypes, shuffleArray } from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import { QuizBase } from "../quizBase";

class WhichIsTheChord extends QuizBase implements IQuiz {
  verifyOptions(chordTypes: string[]): boolean {
    return chordTypes.every((chordType) => allChordTypes.includes(chordType));
  }

  chosenChordType: string;
  chosenChordTypeShuffledChordTones: string[];
  chordPossibilities = ["major", "minor", "diminished", "augmented"];
  questionOptionsArray: string[][];
  constructor(chordTypes: string[]) {
    super(chordTypes);
    this.chosenChordType = getRandomItem(chordTypes);
    this.chosenChordTypeShuffledChordTones = this.createChordTonesShuffled();
    const remainingChordTypeTonesShuffled = this.createRemainingOptions();
    this.questionOptionsArray = shuffleArray([
      this.chosenChordTypeShuffledChordTones,
      ...remainingChordTypeTonesShuffled,
    ]);
  }

  private createChordTonesShuffled() {
    const chord = ChordClass.get(getRandomNote() + " " + this.chosenChordType);
    return shuffleArray(chord.notes);
  }

  private createRemainingOptions() {
    const remainingChordTypePossibilities = this.chordPossibilities.filter(
      (chordType) => chordType !== this.chosenChordType
    );
    return remainingChordTypePossibilities
      .map((chordTypes) => ChordClass.get(getRandomNote() + " " + chordTypes))
      .map((chord) => shuffleArray(chord.notes));
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
    return this.chosenChordTypeShuffledChordTones;
  }
}

export const WhichIsTheChordQuiz: Quiz = WhichIsTheChord;
