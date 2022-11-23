import { get_base_notes, get_chromatic_scale_notes,get_scale } from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import { AudioQuizBase } from "./quizBase/audioQuizBase";
import { Interval} from "@tonaljs/tonal";
import chalk from "chalk";

export const Hear12thTone: Quiz<undefined> = class extends AudioQuizBase implements IQuiz {
  verifyOptions(): boolean {
    return true;
  }

  randomNote;
  startingNote;
  chromaticScaleShuffled;
  missingNote;
  octaveAudio = 4;
  constructor(scaleTypes: Readonly<undefined[]>) {
    super(scaleTypes);
    this.randomNote = get_base_notes().randomItem();
    const chromaticScale = get_scale(this.randomNote, "chromatic");
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
    .toOctave(this.octaveAudio);
    
    const notesWithIntervalsRows = chromaticScaleShuffledInOctave
        .map((note, index) => {
            if (index === 0) return `${note}\n`;
            const interval = Interval.distance(chromaticScaleShuffledInOctave[index - 1], note);
            return `${note}, ${interval}\n`;
        }).join("")
    const answer = `Note: ${chalk.green(this.missingNote)}\nThe intervals are:\n${notesWithIntervalsRows}`
    
    return [
        this.missingNote === guess, 
        answer
    ];
  }

  getAudio() {
    const audio = this.chromaticScaleShuffled
        .filter(note => note !== this.missingNote)
        .toOctave(this.octaveAudio)
        .map(note => { return { noteNames: [note], duration: 500 } });

        return [ { audio : audio, keyboardKey : "space", onInit : true, channel : 1, message : "play audio"} ]
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
