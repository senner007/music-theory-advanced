
import { Chord } from "@tonaljs/chord";
import { getRandomNote, allChordTypes, getChord } from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import { QuizBase } from "../quizBase";
import chalk from "chalk";

export const WhichIsTheChord: Quiz<IQuiz> = class extends QuizBase implements IQuiz {
  verifyOptions(chordTypes: string[]): boolean {
    return chordTypes.every((chordType) => allChordTypes.includes(chordType));
  }

  randomChord: { chord: Chord; notes: string };
  chordPossibilities = ["major", "minor", "diminished", "augmented"];
  chordTypesAndNotes: { chord: Chord; notes: string }[];
  constructor(chordTypes: string[]) {
    super(chordTypes);
    const chordOptions = this.chordPossibilities.map((chordType) => getChord(getRandomNote(), chordType));
    this.chordTypesAndNotes = chordOptions
      .map((chord) => {
        return { chord: chord, notes: chord.notes.shuffleArray().commaSequence() };
      })
      .shuffleArray();

    this.randomChord = this.chordTypesAndNotes.randomItem();
  }

  get quizHead() {
    return [`Select the ${chalk.underline(this.randomChord.chord.type.toUpperCase())} chord in ${chalk.underline('any inversion')}`];
  }
  get questionOptions() {
    return this.chordTypesAndNotes.map((chordTypesAndNotes) => chordTypesAndNotes.notes);
  }
  get question() {
    return `Which is correct?`;
  }
  answer(guess: string): [boolean, string] {
    return [this.randomChord.notes === guess, this.randomChord.notes];
  }

  static get meta() {
    return {
      get getAllOptions() {
        return ["major", "minor", "augmented", "diminished"];
      },
      name: "Which is the chord",
      description: "Choose the chord tones that make up the chord type",
    };
  }
};
