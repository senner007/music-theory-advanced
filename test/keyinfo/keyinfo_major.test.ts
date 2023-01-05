import { it, expect, describe } from "vitest";
import { Key } from "@tonaljs/tonal";
import { keyInfo, getNumeralBySymbol } from "../../src/keyInfo";
import { chordDetect } from "../test-utils";

describe("Test Roman numerals for given chords in - Major - key", () => {
  const key = keyInfo(Key.majorKey("C"));

  it("should return correct roman numeral", () => {
    expect(getNumeralBySymbol(key, chordDetect(["C", "E", "G"]))).toEqual("I");
    expect(getNumeralBySymbol(key, chordDetect(["F", "D", "A"]))).toEqual("ii6");
    expect(getNumeralBySymbol(key, chordDetect(["B", "G", "E"]))).toEqual("iii64");
    expect(getNumeralBySymbol(key, chordDetect(["F", "A", "C", "E"]))).toEqual("IV7");
    expect(getNumeralBySymbol(key, chordDetect(["B", "D", "G", "F"]))).toEqual("V65");
    expect(getNumeralBySymbol(key, chordDetect(["E", "A", "C", "G"]))).toEqual("vi43");
    expect(getNumeralBySymbol(key, chordDetect(["A", "B", "D", "F"]))).toEqual("viio42");
  });
});
