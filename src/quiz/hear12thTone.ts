import { getBaseNotes, get_chromatic_scale_notes,getScale } from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import { AudioQuizBase } from "./quizBase/audioQuizBase";
import { Interval} from "@tonaljs/tonal";
import chalk from "chalk";

export const Hear12thTone: Quiz = class extends AudioQuizBase implements IQuiz {
  verifyOptions(): boolean {
    return true;
  }

  randomNote;
  startingNote;
  chromaticScaleShuffled;
  missingNote;
  constructor(scaleTypes: Readonly<string[]>) {
    super(scaleTypes);
    this.randomNote = getBaseNotes().randomItem();
    const chromaticScale = getScale(this.randomNote, "chromatic");
    this.chromaticScaleShuffled = get_chromatic_scale_notes(chromaticScale).shuffleArray();
    this.missingNote = this.chromaticScaleShuffled.slice(1, this.chromaticScaleShuffled.length).randomItem();
    this.startingNote = this.chromaticScaleShuffled[0];
  }

  get quizHead() {
    return ["Starting note is: " + this.startingNote];
  }
  get questionOptions() {
    return this.chromaticScaleShuffled.slice(1, this.chromaticScaleShuffled.length);
  }
  get question() {
    return "Which note is missing?";
  }
  answer(guess: string): [boolean, string] {

    const chromaticScaleShuffledInOctave = this.chromaticScaleShuffled
    .filter(note => note !== this.missingNote)
    .map(n => n + "4"); // abtract with type safety!
    
    const rowAnswer = chromaticScaleShuffledInOctave
        .map((note, index) => {
            if (index === 0) note;
            const interval = Interval.distance(chromaticScaleShuffledInOctave[index - 1], note);
            return `${note}, ${interval}\n`;
        }).reduce((a, b) => a + b, "")
    const answer = `Note: ${chalk.green(this.missingNote)}\nThe intervals are:\n${rowAnswer}`
    
    return [
        this.missingNote === guess, 
        answer
    ];
  }

  getAudio() {
    return this.chromaticScaleShuffled
        .filter(note => note !== this.missingNote)
        .map(n => n + "4")
        .map(note => { return { noteName: note, duration: 500 } });
  }

  static meta() {
    return {
      get getAllOptions() {
        return [];
      },
      name: "Hear the missing 12th tone",
      description: "Listen to the 12-tone row with one note missing. Identify the missing note.",
    };
  }
};
