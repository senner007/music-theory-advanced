import { Chord, Progression } from "@tonaljs/tonal";
import { Chord as IChord } from "@tonaljs/chord";
import { MajorKey, MinorKey } from "@tonaljs/key";

export function keyInfo(key: MajorKey | MinorKey) {
  function getChords(chordQualities: readonly string[], scale: readonly string[]) {
    return chordQualities.map((q, index: number) => {
      return Chord.getChord(q, scale[index]);
    });
  }

  function InvChords(primaryChords: IChord[], inversion: number) {
    return primaryChords.map((c) => {
      return Chord.getChord(c.type, c.tonic!, c.notes[inversion]);
    });
  }

  function getPrimaryChords(chordQualities: string[], romanNumerals: string[], scale: readonly string[]) {
    const primaryChords = getChords(chordQualities, scale).map((c, index) => {
      return { ...c, romanNumeral: romanNumerals[index] };
    });
    const firstInversionChords = InvChords(primaryChords, 1).map((c, index) => {
      return { ...c, romanNumeral: romanNumerals[index] + "6" };
    });
    const secondInversionChords = InvChords(primaryChords, 2).map((c, index) => {
      return { ...c, romanNumeral: romanNumerals[index] + "64" };
    });
    return {
      primaryChords,
      firstInversionChords,
      secondInversionChords,
      allPrimaryChords: () => [...primaryChords, ...firstInversionChords, ...secondInversionChords],
    } as const;
  }

  function getSeventhChords(seventhChordsSymbols: readonly string[], romanNumerals: string[]) {
    const seventhChords = seventhChordsSymbols.map(c => Chord.get(c)).map((c, index) => {
      return { ...c, romanNumeral: romanNumerals[index] + "7" };
    });

    const firstInversionChords = InvChords(seventhChords, 1).map((c, index) => {
      return { ...c, romanNumeral: romanNumerals[index] + "65" };
    });

    const secondInversionChords = InvChords(seventhChords, 2).map((c, index) => {
      return { ...c, romanNumeral: romanNumerals[index] + "43" };
    });

    const thirdInversionChords = InvChords(seventhChords, 3).map((c, index) => {
      return { ...c, romanNumeral: romanNumerals[index] + "42" };
    });
    
    return {
      seventhChords,
      firstInversionChords,
      secondInversionChords,
      thirdInversionChords,
      allSeventhChords: () => [...seventhChords, ...firstInversionChords, ...secondInversionChords, ...thirdInversionChords],
    } as const;
  }

  if (key.type === "minor") {
    const naturalNumerals = ["i", "iio", "III", "iv", "v", "bVI", "bVII"];
    const harmonicNumerals = ["i", "iio", "III+", "iv", "V", "bVI", "viio"];
    const melodicNumerals = ["i", "ii", "III+", "IV", "V", "vio", "viio"];

    const melodicChords = [...key.melodic.chords] as string[];
    melodicChords[0] = key.melodic.tonic + "mMaj7";
    const obj = {
      ...key,
      natural: {
        ...key.natural,
        ...getPrimaryChords(["m", "dim", "M", "m", "m", "M", "M"], naturalNumerals, key.natural.scale),
        ...getSeventhChords(key.natural.chords, naturalNumerals),
      },
      harmonic: {
        ...key.harmonic,
        ...getPrimaryChords(["m", "dim", "aug", "m", "M", "M", "dim"], harmonicNumerals, key.harmonic.scale),
        ...getSeventhChords(key.harmonic.chords, ["iM", "iio", "III+M", "iv", "V", "bVIM", "viio"]),
      },
      melodic: {
        ...key.melodic,
        chords :  melodicChords,
        ...getPrimaryChords(["m", "m", "aug", "M", "M", "dim", "dim"], melodicNumerals, key.melodic.scale),
        ...getSeventhChords(melodicChords, ["iM", "ii", "III+M", "iv", "V", "VI", "viio"]),
      },
    } as const;
    return obj;
  }

  const majorNumerals = ["I", "ii", "iii", "IV", "V", "vi", "viio"];

  const obj = {
    ...key,
    ...getPrimaryChords(["M", "m", "m", "M", "M", "m", "dim"], majorNumerals, key.scale),
    ...getSeventhChords(key.chords, majorNumerals),
  } as const;
  return obj;
}

type KeyInfo = ReturnType<typeof keyInfo>;

export function getKeyChords(keyInfo: KeyInfo) {
  if (keyInfo.type === "major") {
    return [...keyInfo.allPrimaryChords(), ...keyInfo.allSeventhChords()];
  }
  return [
    ...keyInfo.natural.allPrimaryChords(),
    ...keyInfo.natural.allSeventhChords(),
    ...keyInfo.harmonic.allPrimaryChords(),
    ...keyInfo.harmonic.allSeventhChords(),
    ...keyInfo.melodic.allPrimaryChords(),
    ...keyInfo.melodic.allSeventhChords(),
  ];
}

export function getNumeralBySymbol(keyInfo: KeyInfo, chordSymbols: string[]) {
  const keyChords = getKeyChords(keyInfo);
  
  const chordsInKey = chordSymbols.filter((chord) => keyChords.map((c) => c.symbol).includes(chord));
  const chord = chordsInKey.length > 0 ? chordsInKey[0] : chordSymbols[0]
  try {
    if (keyInfo.type === "major") {
      return keyChords.filter((c) => c.symbol === chord)[0].romanNumeral;
    }
    return keyChords.filter((c) => c.symbol === chord)[0].romanNumeral;
  } catch (error) {
    return Progression.toRomanNumerals(keyInfo.tonic, [chord])[0];
  }
}
