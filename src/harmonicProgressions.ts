import { Note } from "@tonaljs/tonal"
import { noteAllAccidentalOctave } from "./utils"
import fs from 'fs';
import { LogError } from "./dev-utils";

export function romanNumeralChord(romanNumeral: RomanNumeralType | RomanNumeralBelow) {
    if (romanNumeral.includes("-a")) {
      const basicRomanNumeral: RomanNumeralType = to_roman_numeral(romanNumeral as RomanNumeralBelow);
      return to_actave_above(romanNumeralsDict[basicRomanNumeral]);
    }
    return romanNumeralsDict[romanNumeral as RomanNumeralType];
  }
  
  type dict = Record<string, noteAllAccidentalOctave[]>;
  
  const romanNumeralsDict = {
    i: ["C3", "Eb3", "G3"],
    i6: ["Eb3", "G3", "C4"],
    i64: ["G3", "C4", "Eb4"],
    I: ["C3", "E3", "G3"],
    I6: ["E3", "G3", "C4"],
    I64: ["G3", "C4", "E4"],
    V: ["G3", "B3", "D4"],
    V64: ["D3", "G3", "B3"],
    V7: ["G3", "B3", "D4", "F4"],
    "V7(mP5)" : ["G3", "B3", "F4"],
    V6: ["B2", "D3", "G3"],
    V65: ["B3", "D4", "F4", "G4"],
    ii: ["D3", "F3", "A3"],
    iio6: ["F3", "Ab3", "D4"],
    iio64: ["Ab3", "D4", "F4"],
    ii6: ["F3", "A3", "D4"],
    ii64: ["A3", "D4", "F4"],
    iii6: ["G3", "B3", "E4"],
    iii64: ["B3", "E4", "G4"],
    iv: ["F3", "Ab3", "C4"],
    iv6: ["Ab3", "C4", "F4"],
    iv64: ["C3", "F3", "Ab3"],
    IV: ["F3", "A3", "C4"],
    IV6: ["A3", "C4", "F4"],
    IV64: ["C3", "F3", "A3"],
    vi: ["A3", "C4", "E4"],
    vii: ["B3", "D4", "F4"],
    viio6: ["D4", "F4", "B4"]
  } satisfies dict;
  
  export type Progression = typeof progressions[number];
  
  export type RomanNumeralType = keyof typeof romanNumeralsDict;
  
  export type RomanNumeralBelow = `${RomanNumeralType}-a`;
  
  // function to_actave_under(notes: Readonly<noteAllAccidentalOctave[]>): noteAllAccidentalOctave[] {
  //   return notes.map((n) => Note.transpose(n, "-8P")) as noteAllAccidentalOctave[];
  // }

  function to_actave_above(notes: Readonly<noteAllAccidentalOctave[]>): noteAllAccidentalOctave[] {
    return notes.map((n) => Note.transpose(n, "8P")) as noteAllAccidentalOctave[];
  }
  
  export function to_roman_numeral(romanNumeral: RomanNumeralType | RomanNumeralBelow): RomanNumeralType {
    return romanNumeral.replace(/-a/g, "") as RomanNumeralType;
  }


type ProgressionObject = Readonly<
  {
    chords: Readonly<(RomanNumeralType | RomanNumeralBelow)[]>;
    bass: Readonly<(RomanNumeralType | RomanNumeralBelow)[]>;
    isMajor: boolean
    description?: string;
    isDiatonic: boolean;
  }[]
>;

export const progressions = (JSON.parse(fs.readFileSync('harmonic-progressions.json') as any) as ProgressionObject);

(function JSONContentVerify() {
    const progressionsTemp: string[] = [];
    progressions.forEach((key, keyIndex) => {

        const chordsString = key.chords.join("") + key.bass.join("");
        if (progressionsTemp.includes(chordsString)) {
            LogError(
`Json content error at: 
Index : ${keyIndex} progression : ${chordsString}
Progression is not unique`
            )
        }
        progressionsTemp.push(chordsString)

        key.chords.forEach((chord, chordIndex) => {
            if (!(chord in romanNumeralsDict || to_roman_numeral(chord) in romanNumeralsDict)) {
                LogError(
`Json content error at: 
Index : ${chordIndex} chord : ${chord}
Roman numeral not in dictionary`
                )
            }
        })
    })
})();

