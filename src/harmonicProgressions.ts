import { Note } from "@tonaljs/tonal"
import { noteAllAccidentalOctave, UniqueArray  } from "./utils"

export function romanNumeralChord(romanNumeral: RomanNumeralType | RomanNumeralBelow) {
    if (romanNumeral.includes("-u")) {
      const basicRomanNumeral: RomanNumeralType = to_roman_numeral(romanNumeral as RomanNumeralBelow);
      return to_actave_under(romanNumeralsDict[basicRomanNumeral]);
    }
    return romanNumeralsDict[romanNumeral as RomanNumeralType];
  }
  
  type dict = Record<string, noteAllAccidentalOctave[]>;
  
  const romanNumeralsDict = {
    I: ["C3", "E3", "G3"],
    I6: ["E3", "G3", "C4"],
    I64: ["G3", "C4", "E4"],
    V: ["G3", "B3", "D4"],
    V6: ["B3", "D4", "G4"],
    V65: ["B3", "D4", "F4", "G4"],
    V7: ["G3", "B3", "D4", "F4"],
    ii: ["D3", "F3", "A3"],
    ii64: ["A3", "D4", "F4"],
    iii6: ["G3", "B3", "E4"],
    iii64: ["B3", "E4", "G4"],
    IV: ["F3", "A3", "C4"],
    IV6: ["A3", "C4", "F4"],
    IV64: ["C3", "F3", "A3"],
    vi: ["A3", "C4", "E4"],
    vii: ["B3", "D4", "F4"],
  } satisfies dict;
  
  
  export type Progression = typeof progressions[number];
  
  export type RomanNumeralType = keyof typeof romanNumeralsDict;
  
  export type RomanNumeralBelow = `${RomanNumeralType}-u`;
  
  function to_actave_under(notes: Readonly<noteAllAccidentalOctave[]>): noteAllAccidentalOctave[] {
    return notes.map((n) => Note.transpose(n, "-8P")) as noteAllAccidentalOctave[];
  }
  
  export function to_roman_numeral(romanNumeral: RomanNumeralType | RomanNumeralBelow): RomanNumeralType {
    return romanNumeral.replace(/-u/g, "") as RomanNumeralType;
  }


type ProgressionObject = Readonly<
  {
    chords: Readonly<(RomanNumeralType | RomanNumeralBelow)[]>;
    description?: string;
    isDiatonic: boolean;
  }[]
>;

export const progressionsObj = [
  { chords: ["I", "I6", "IV", "V", "I"], isDiatonic: true },
  { chords: ["I6", "IV", "V65-u", "I"], isDiatonic: true },
  { chords: ["I", "V7-u", "I"], isDiatonic: true },
  { chords: ["I", "ii", "IV64", "V65-u"], isDiatonic: true },
  {
    chords: ["I", "V6-u", "vi-u", "iii6-u", "IV6-u", "I64-u", "IV6-u", "V6-u"],
    description: "Pachelbel canon",
    isDiatonic: true,
  },
  {
    chords: ["I", "IV64", "vii-u", "iii64-u", "vi-u", "ii64-u", "V6-u", "I"],
    description: "Circle of fifth progression",
    isDiatonic: true,
  },
] as const;

export const progressions: ProgressionObject & UniqueArray<typeof progressionsObj> = progressionsObj // compile error if not unique


