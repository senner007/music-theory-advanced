import { it, expect, describe } from "vitest";
import { Key } from "@tonaljs/tonal";
import { keyInfo, getNumeralBySymbol } from "../../src/keyInfo";
import { chordDetect } from "../test-utils";

describe("Test Roman numerals for given chords in - Minor melodic - key", () => {
  const key = keyInfo(Key.minorKey("C"));

  it("should return correct roman numeral", () => {
    expect(getNumeralBySymbol(key, chordDetect(["C", "Eb", "G"]))).toEqual("i");
    expect(getNumeralBySymbol(key, chordDetect(["F", "D", "A"]))).toEqual("ii6");
    expect(getNumeralBySymbol(key, chordDetect(["B", "G", "Eb"]))).toEqual("III+64");
    expect(getNumeralBySymbol(key, chordDetect(["F", "A", "C", "Eb"]))).toEqual("IV7");
    expect(getNumeralBySymbol(key, chordDetect(["B", "D", "G", "F"]))).toEqual("V65");
    expect(getNumeralBySymbol(key, chordDetect(["Eb", "A", "C", "G"]))).toEqual("vio43");
    expect(getNumeralBySymbol(key, chordDetect(["A", "B", "D", "F"]))).toEqual("viio42");
  });
});
