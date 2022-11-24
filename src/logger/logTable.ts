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
  private sortedMelody;
  constructor(public melody: baseNoteAllAccidentalOctave[], private key: baseNoteCommonAccidental) {
    console.log(this.key);
    this.sortedMelody = Note.sortedNames(this.melody) as baseNoteAllAccidentalOctave[];
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
      obj[index] = Array.from({ length: solfege.length });
    });

    solfege.melody.forEach((c, index: number) => {
      const key = solfege.getDistanceFromLowest(c);
      const syllable = solfegeObj[getNoteRemoveOctave(c)] as Syllable;
      obj[key][index] = syllable;
    });

    const rows = Object.values(obj);

    var table = AsciiTable.factory({
      heading: [...Array(solfege.melody.length).keys()],
      rows: rows.reverse(),
    });

    console.log(table.toString());
  }
}
