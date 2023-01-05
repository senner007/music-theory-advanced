import { it, expect, describe} from "vitest";
import { Key } from "@tonaljs/tonal";
import { keyInfo, getNumeralBySymbol } from "../../src/keyInfo";
import { chordDetect } from "../test-utils";

describe("Test Roman numerals for given chords in - Minor natural - key", () => {
  const key = keyInfo(Key.minorKey("C"));

  it("should return correct roman numeral", () => {
    expect(getNumeralBySymbol(key, chordDetect(["C", "Eb", "G"]))).toEqual("i");
    expect(getNumeralBySymbol(key, chordDetect(["F", "D", "Ab"]))).toEqual("iio6");
    expect(getNumeralBySymbol(key, chordDetect(["Bb", "G", "Eb"]))).toEqual("III64");
    expect(getNumeralBySymbol(key, chordDetect(["F", "Ab", "C", "Eb"]))).toEqual("iv7");
    expect(getNumeralBySymbol(key, chordDetect(["Bb", "D", "G", "F"]))).toEqual("v65");
    expect(getNumeralBySymbol(key, chordDetect(["Eb", "Ab", "C", "G"]))).toEqual("bVI43");
    expect(getNumeralBySymbol(key, chordDetect(["Ab", "Bb", "D", "F"]))).toEqual("bVII42");
  });
});
