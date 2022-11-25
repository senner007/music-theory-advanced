import { Interval, Note } from "@tonaljs/tonal";
import { LogError } from "./dev-utils";
import { INotePlay } from "./midiplay";
import { noteAllAccidentalOctave, noteSingleAccidental, noteAllAccidental, octave } from "./utils";

export class SolfegeMelody {
  private verify_duration_length() {
    if (this.duration > 30) LogError("Melody duration exceeded");
  }

  private sortedMelody;
  constructor(private melody: INotePlay[], private key: noteSingleAccidental) {
    this.sortedMelody = this.sort_melody();
    this.verify_duration_length();
  }

  private transpose_to_melody_key(note: noteAllAccidentalOctave): noteAllAccidentalOctave {
    const interval = Interval.distance(this.key, "C");
    return Note.transpose(note, interval) as noteAllAccidentalOctave;
  }

  private sort_melody(): noteAllAccidentalOctave[] {
    const flatMelody = this.melody.map((n) => n.noteNames).flat();
    return Note.sortedNames(flatMelody) as noteAllAccidentalOctave[];
  }

  public get getMelody() {
    return Object.freeze(this.melody);
  }

  private get lowest(): noteAllAccidentalOctave {
    return this.sortedMelody[0];
  }

  private get highest(): noteAllAccidentalOctave {
    return this.sortedMelody.at(-1) as noteAllAccidentalOctave;
  }

  get length() {
    return this.melody.length;
  }

  get duration(): number {
    return this.melody.map((n) => n.duration).reduce((a, b) => a + b, 0);
  }

  syllable(note: noteAllAccidentalOctave): Syllable {
    const transposedNote = this.transpose_to_melody_key(note);
    return syllables_in_key_of_c[remove_octave(transposedNote)] as Syllable;
  }

  distance_from_lowest(note: noteAllAccidentalOctave): number {
    const intervalDistance = Interval.distance(this.lowest, note);
    return Interval.semitones(intervalDistance) as number;
  }

  ambitus(): number {
    const semitones = this.distance_from_lowest(this.highest);
    if (!semitones) LogError("Semitone calculation error");
    return semitones;
  }
}

export type Syllable =
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

export const syllables_in_key_of_c: Readonly<Partial<Record<noteAllAccidental, Syllable>>> = {
  // fill remaining and remove partial
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

type RemoveOctave<T> = T extends `${infer U}${octave}` ? U : never;

function remove_octave<T extends `${noteAllAccidental}${octave}`>(note: T): RemoveOctave<T> {
  return note.replace(/[0-9]/g, "") as RemoveOctave<T>;
}
