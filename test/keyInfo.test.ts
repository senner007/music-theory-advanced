import { expect, describe, it } from "vitest";
import { Key } from "@tonaljs/tonal";
import { keyInfo, getKeyChords } from "../src/keyInfo";

describe("Test KeyInfo chords for - Major - key", () => {
  const keyInfoChords = getKeyChords(keyInfo(Key.majorKey("C")));
  const tonic = keyInfoChords[0];
  const tonic_1st_inversion = keyInfoChords[7];
  const tonic_2nd_Inversion = keyInfoChords[14];
  const tonicM7 = keyInfoChords[21];
  const tonicM7_1st_inversion = keyInfoChords[28];
  const tonicM7_2st_inversion = keyInfoChords[35];
  const tonicM7_3rd_inversion = keyInfoChords[42];

  it("should return correct key chord - symbols", () => {
    expect(tonic.symbol).toEqual("CM");
    expect(tonic_1st_inversion.symbol).toEqual("CM/E");
    expect(tonic_2nd_Inversion.symbol).toEqual("CM/G");
    expect(tonicM7.symbol).toEqual("Cmaj7");
    expect(tonicM7_1st_inversion.symbol).toEqual("Cmaj7/E");
    expect(tonicM7_2st_inversion.symbol).toEqual("Cmaj7/G");
    expect(tonicM7_3rd_inversion.symbol).toEqual("Cmaj7/B");
  });

  it("should return correct key chord - roman numerals", () => {
    expect(tonic.romanNumeral).toEqual("I");
    expect(tonic_1st_inversion.romanNumeral).toEqual("I6");
    expect(tonic_2nd_Inversion.romanNumeral).toEqual("I64");
    expect(tonicM7.romanNumeral).toEqual("I7");
    expect(tonicM7_1st_inversion.romanNumeral).toEqual("I65");
    expect(tonicM7_2st_inversion.romanNumeral).toEqual("I43");
    expect(tonicM7_3rd_inversion.romanNumeral).toEqual("I42");
  });
});

describe("Test KeyInfo chords for - Minor natural - key", () => {
  const keyInfoChords = getKeyChords(keyInfo(Key.minorKey("C")));
  const tonic = keyInfoChords[0];
  const tonic_1st_inversion = keyInfoChords[7];
  const tonic_2nd_Inversion = keyInfoChords[14];
  const tonicM7 = keyInfoChords[21];
  const tonicM7_1st_inversion = keyInfoChords[28];
  const tonicM7_2st_inversion = keyInfoChords[35];
  const tonicM7_3rd_inversion = keyInfoChords[42];

  it("should return correct key chord - symbols", () => {
    expect(tonic.symbol).toEqual("Cm");
    expect(tonic_1st_inversion.symbol).toEqual("Cm/Eb");
    expect(tonic_2nd_Inversion.symbol).toEqual("Cm/G");
    expect(tonicM7.symbol).toEqual("Cm7");
    expect(tonicM7_1st_inversion.symbol).toEqual("Cm7/Eb");
    expect(tonicM7_2st_inversion.symbol).toEqual("Cm7/G");
    expect(tonicM7_3rd_inversion.symbol).toEqual("Cm7/Bb");
  });

  it("should return correct key chord - roman numerals", () => {
    expect(tonic.romanNumeral).toEqual("i");
    expect(tonic_1st_inversion.romanNumeral).toEqual("i6");
    expect(tonic_2nd_Inversion.romanNumeral).toEqual("i64");
    expect(tonicM7.romanNumeral).toEqual("i7");
    expect(tonicM7_1st_inversion.romanNumeral).toEqual("i65");
    expect(tonicM7_2st_inversion.romanNumeral).toEqual("i43");
    expect(tonicM7_3rd_inversion.romanNumeral).toEqual("i42");
  });
});

describe("Test KeyInfo chords for - Minor harmonic - key", () => {
  const keyInfoChords = getKeyChords(keyInfo(Key.minorKey("C")));
  const tonic = keyInfoChords[49];
  const tonicM7 = keyInfoChords[70];

  it("should return correct key chord - symbols", () => {
    expect(tonic.symbol).toEqual("Cm");
    expect(tonicM7.symbol).toEqual("CmMaj7");
  });

  it("should return correct key chord - roman numerals", () => {
    expect(tonic.romanNumeral).toEqual("i");
    expect(tonicM7.romanNumeral).toEqual("iM7");
  });
});

describe("Test KeyInfo chords for - Minor melodic - key", () => {
  const keyInfoChords = getKeyChords(keyInfo(Key.minorKey("C")));
  const tonic = keyInfoChords[98];
  const tonicM7 = keyInfoChords[119];

  it("should return correct key chord - symbols", () => {
    expect(tonic.symbol).toEqual("Cm");
    expect(tonicM7.symbol).toEqual("CmMaj7");
  });

  it("should return correct key chord - roman numerals", () => {
    expect(tonic.romanNumeral).toEqual("i");
    expect(tonicM7.romanNumeral).toEqual("iM7");
  });
});
