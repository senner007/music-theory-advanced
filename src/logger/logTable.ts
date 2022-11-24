import { Interval, Note } from "@tonaljs/tonal";
// @ts-ignore
import AsciiTable from "ascii-table";
import { LogError } from "../dev-utils";

import { baseNoteAllAccidental, baseNoteAllAccidentalOctave, baseNoteCommonAccidental } from "../utils";

export interface ISolfegeNote {
  note: baseNoteAllAccidentalOctave;
  duration: 1 | 2;
}

export class SolfegeMelody {

  private verifyDuration() {
    if (this.duration > 30) LogError("Melody duration exceeded")
  }

  private sortedMelody;
  constructor(public melody: ISolfegeNote[], private key: baseNoteCommonAccidental) {
    console.log(this.key);
    this.sortedMelody = this.getSortedMelody();
    this.verifyDuration();
  }

  private getSortedMelody(): baseNoteAllAccidentalOctave[] {
    return Note.sortedNames(this.melody.map(n => n.note)) as baseNoteAllAccidentalOctave[];
  }

  private get lowest(): baseNoteAllAccidentalOctave {
    return this.sortedMelody[0];
  }

  private get highest(): baseNoteAllAccidentalOctave {
    return this.sortedMelody.at(-1) as baseNoteAllAccidentalOctave;
  }

  get length() {
    return this.melody.length;
  }

  get duration(): number {
    return this.melody.map(n => n.duration).reduce((a, b) => a + b, 0);
  }

  getDistanceFromLowest(note: baseNoteAllAccidentalOctave): number {
    const intervalDistance = Interval.distance(this.lowest, note);
    return Interval.semitones(intervalDistance) as number;
  }

  getAmbitus(): number {
    const semitones = this.getDistanceFromLowest(this.highest);
    if (!semitones) LogError("Semitone calculation error");
    return semitones;
  }
}

interface IObj {
  [key: string]: Syllable[];
}

type Syllable =
  | "Daw"
  | "De"
  | "Do"
  | "Di"
  | "Dai"
  | "Ra"
  | "Re"
  | "Ri"
  | "Mi"
  | "Mai"
  | "Fe"
  | "Fa"
  | "Fi"
  | "Se"
  | "So"
  | "Si"
  | "Le"
  | "La"
  | "Li"
  | "Te"
  | "Ti"
  | "Tai";

const solfegeObj: Partial<Record<baseNoteAllAccidental, Syllable>> = {
  Cbb: "Daw",
  Cb: "De",
  C: "Do",
  "C#": "Di",
  "C##": "Dai",
  Db: "Ra",
  D: "Re",
  "D#": "Ri",
  E: "Mi",
  "E#": "Mai",
  Fb: "Fe",
  F: "Fa",
  "F#": "Fi",
  Gb: "Se",
  G: "So",
  "G#": "Si",
  Ab: "Le",
  A: "La",
  "A#": "Li",
  Bb: "Te",
  B: "Ti",
  "B#": "Tai",
};

function getNoteRemoveOctave(note: baseNoteAllAccidentalOctave): baseNoteAllAccidental {
  return note.replace(/[0-9]/g, "") as baseNoteAllAccidental;
}

export class LogTable {
  static write(solfege: SolfegeMelody) {
    const ambitus = solfege.getAmbitus();

    const obj: IObj = {};
    Array.from({ length: ambitus + 1 }).forEach((_, index: number) => {
      obj[index] = Array.from({ length: solfege.duration });
    });

    let counter: number = 0;

    solfege.melody.forEach((c) => {
      const key = solfege.getDistanceFromLowest(c.note);
      const syllable = solfegeObj[getNoteRemoveOctave(c.note)] as Syllable;
      obj[key][counter] = syllable;
      counter = counter + c.duration;
    });

    const rows = Object.values(obj);

    var table = AsciiTable.factory({
      heading: [...Array(solfege.duration).keys()]
        .map(h => h % 4 === 0 ? "0" + (h/4 + 1) : "  ")
        .map((h, index) => index === 0 ? "01" : h),
      rows: rows.reverse(),
    });
    
    console.log(table.toString());
  }
}
