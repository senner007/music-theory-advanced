import { noteAllAccidentalOctave } from "./utils";
import fs from "fs";
import { LogError } from "./dev-utils";
import { Note } from "@tonaljs/tonal";

export enum IntervalDistance {
  OctaveUp = "8P",
  OctaveDown = "-8P",
}

export function romanNumeralChord(romanNumeral: RomanNumeralType | RomanNumeralAbove) {
  if (romanNumeral.includes("-a")) {
    const basicRomanNumeral: RomanNumeralType = to_roman_numeral(romanNumeral as RomanNumeralAbove);
    return to_actave_above(romanNumeralsDict[basicRomanNumeral]);
  }
  return romanNumeralsDict[romanNumeral as RomanNumeralType];
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
  V7no5: ["G4", "B4", "F5"],
  V742no5: ["F4", "G4", "B4"],
  V6: ["B3", "D4", "G4"],
  V65: ["B4", "D5", "F5", "G5"],
  ii: ["D4", "F4", "A4"],
  iio: ["D4", "F4", "Ab4"],
  iio6: ["F4", "Ab4", "D5"],
  iio64: ["Ab4", "D5", "F5"],
  ii6: ["F4", "A4", "D5"],
  ii64: ["A4", "D5", "F5"],
  iii: ["E4", "G4", "B4"],
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
  vi42no5: ["G4", "A4", "C5"],
  VI: ["Ab4", "C5", "Eb5"],
  VI6: ["C5", "Eb5", "Ab5"],
  VI64: ["Eb4", "Ab4", "C5"],
  vii: ["B4", "D5", "F5"],
  vii64: ["F4", "B4", "D5"],
  viio6: ["D5", "F5", "B5"],
  vii42no5: ["A4", "B4", "D5"],
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

const level_1 = JSON.parse(fs.readFileSync("harmonic-progressions.json") as any) as ProgressionsJSON;
const level_2 = JSON.parse(fs.readFileSync("harmonic-progressions-level2.json") as any) as ProgressionsJSON;
const level_3 = JSON.parse(fs.readFileSync("harmonic-progressions-level3.json") as any) as ProgressionsJSON;

const level_20 = JSON.parse(fs.readFileSync("harmonic-progressions-circle-of-fifths.json") as any) as ProgressionsJSON;

export const progressions = [
  ...level_1.progressions,
  ...level_2.progressions,
  ...level_3.progressions,
  ...level_20.progressions,
];

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
