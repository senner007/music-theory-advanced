import { noteAllAccidentalOctave, noteSingleAccidental } from "./utils";
import fs from "fs";
import { LogError } from "./dev-utils";
import { Interval, Note } from "@tonaljs/tonal";

export enum IntervalDistance {
  OctaveUp = "8P",
  OctaveDown = "-8P"
}

interface IProgression {
  readonly chords: (readonly noteAllAccidentalOctave[])[];
  readonly bass: readonly noteAllAccidentalOctave[];
}

export function romanNumeralChord(romanNumeral: RomanNumeralType | RomanNumeralAbove) {
  if (romanNumeral.includes("-a")) {
    const basicRomanNumeral: RomanNumeralType = to_roman_numeral(romanNumeral as RomanNumeralAbove);
    return to_actave_above(romanNumeralsDict[basicRomanNumeral]);
  }
  return romanNumeralsDict[romanNumeral as RomanNumeralType];
}

export function transposeProgression( // Test me!
  progression: IProgression,
  key: noteSingleAccidental,
) {
  const distanceToKey = Interval.distance("C", key);
  const transposed: IProgression = transposeProgressionByInterval(progression, distanceToKey);
  return adjustTranspositionWithinBounds(transposed);
}

function adjustTranspositionWithinBounds( 
  progression: IProgression, 
  bounds: { high: noteAllAccidentalOctave; low: noteAllAccidentalOctave } = { high: "G5", low: "C4" })
  {
  const notesSorted = Note.sortedNames(progression.chords.flatMap((n) => n));
  const lowestNote = notesSorted[0];
  const highestNote = notesSorted[notesSorted.length - 1];

  if (Note.sortedNames([bounds.low, lowestNote])[0] === lowestNote) {
    return transposeProgressionByInterval(progression, IntervalDistance.OctaveUp);
  }
  if (Note.sortedNames([bounds.high, highestNote])[1] === highestNote) {
    return transposeProgressionByInterval(progression, IntervalDistance.OctaveDown);
  }
  return progression;
  }

function transposeProgressionByInterval(progression : IProgression, interval: string) {
  return {
    chords: progression.chords.map((c) => c.transposeBy(interval)),
    bass: progression.bass.transposeBy(interval),
  }as const;
}

type dict = Record<string, noteAllAccidentalOctave[]>;

const romanNumeralsDict = {
  i: ["C4", "Eb4", "G4"],
  i6: ["Eb4", "G4", "C5"],
  i64: ["G4", "C5", "Eb5"],
  I: ["C4", "E4", "G4"],
  I6: ["E4", "G4", "C5"],
  I64: ["G4", "C5", "E5"],
  V: ["G4", "B4", "D5"],
  V64: ["D4", "G4", "B4"],
  V7: ["G4", "B4", "D5", "F5"],
  "V7(mP5)": ["G4", "B4", "F5"],
  V6: ["B3", "D4", "G4"],
  V65: ["B4", "D5", "F5", "G5"],
  ii: ["D4", "F4", "A4"],
  iio: ["D4", "F4", "Ab4"],
  iio6: ["F4", "Ab4", "D5"],
  iio64: ["Ab4", "D5", "F5"],
  ii6: ["F4", "A4", "D5"],
  ii64: ["A4", "D5", "F5"],
  iii6: ["G4", "B4", "E5"],
  iii64: ["B4", "E5", "G5"],
  iv: ["F4", "Ab4", "C5"],
  iv6: ["Ab4", "C5", "F5"],
  iv64: ["C4", "F4", "Ab4"],
  IV: ["F4", "A4", "C5"],
  IV6: ["A4", "C5", "F5"],
  IV64: ["C4", "F4", "A4"],
  vi: ["A4", "C5", "E5"],
  vi6: ["C4", "E4", "A4"],
  vi64: ["E4", "A4", "C5"],
  VI: ["Ab4", "C5", "Eb5"],
  VI6: ["C5", "Eb5", "Ab5"],
  VI64: ["Eb4", "Ab4", "C5"],
  vii: ["B4", "D5", "F5"],
  viio6: ["D5", "F5", "B5"],
} satisfies dict;

export type RomanNumeralType = keyof typeof romanNumeralsDict;

export type RomanNumeralAbove = `${RomanNumeralType}-a`;

function to_actave_above(notes: Readonly<noteAllAccidentalOctave[]>): noteAllAccidentalOctave[] {
  return notes.map((n) => Note.transpose(n, IntervalDistance.OctaveUp)) as noteAllAccidentalOctave[];
}

export function to_roman_numeral(romanNumeral: RomanNumeralType | RomanNumeralAbove): RomanNumeralType {
  return romanNumeral.replace(/-a/g, "") as RomanNumeralType;
}

export type Progression = Readonly<{
  chords: Readonly<(RomanNumeralType | RomanNumeralAbove)[]>;
  bass: Readonly<noteAllAccidentalOctave[]>;
  isMajor: boolean;
  description?: string;
  isDiatonic: boolean;
  tags: string[];
}>;

type ProgressionsJSON = {
  level: number;
  description: string;
  progressions: Progression[];
};

const progressionsJsonLevel1 = JSON.parse(fs.readFileSync("harmonic-progressions.json") as any) as ProgressionsJSON;
const progressionsJsonLevel2 = JSON.parse(
  fs.readFileSync("harmonic-progressions-level2.json") as any
) as ProgressionsJSON;

export const progressions = [...progressionsJsonLevel1.progressions, ...progressionsJsonLevel2.progressions];

(function JSONContentVerify() {
  const progressionsTemp: string[] = [];
  progressions.forEach((key, keyIndex) => {
    const chordsString = key.chords.join("") + key.bass.join("");
    if (progressionsTemp.includes(chordsString)) {
      
      LogError(
        `Json content error at: 
Description : ${key.description} progression : ${chordsString}
Progression is not unique. Similar to progression at index: ${progressionsTemp.indexOf(chordsString)}`
      );
    }
    progressionsTemp.push(chordsString);

    key.chords.forEach((chord, chordIndex) => {
      if (!(chord in romanNumeralsDict || to_roman_numeral(chord) in romanNumeralsDict)) {
        LogError(
          `Json content error at: 
Index : ${chordIndex} chord : ${chord}
Roman numeral not in dictionary`
        );
      }
    });
  });
})();
