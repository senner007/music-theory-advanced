import { Chord, Key } from "@tonaljs/tonal";
import { Chord as IChord } from "@tonaljs/chord";
import { MajorKey, MinorKey } from "@tonaljs/key";


export function keyInfo(key: MajorKey | MinorKey) {
  function getPrimaryChords(chordQualities: string[], scale: readonly string[]) {
    return chordQualities.map((q, index: number) => {
      return Chord.getChord(q, scale[index]);
    });
  }
  function InvChords(primaryChords: IChord[], inversion: number) {
    return primaryChords.map((c) => {
      return Chord.getChord(c.type, c.tonic!, c.notes[inversion]);
    });
  }

  function getChords(chordQualities: string[], scale: readonly string[]) {
    const primaryChords = getPrimaryChords(chordQualities, scale);
    const firstInv = InvChords(primaryChords, 1);
    const secondIv = InvChords(primaryChords, 2);
    return {
      primaryChords: primaryChords,
      firstInversionChords: firstInv,
      secondInversionChords: secondIv,
      allPrimaryChordNames: () => [...primaryChords, ...firstInv, ...secondIv].map((c) => c.symbol),
    } as const;
  }

  if (key.type === "minor") {
    const obj = {
      ...key,
      natural: {
        ...key.natural,
        ...getChords(["m", "dim", "M", "m", "m", "M", "M"], key.natural.scale),
      },
      harmonic: {
        ...key.harmonic,
        ...getChords(["m", "dim", "aug", "m", "M", "M", "dim"], key.harmonic.scale),
      },
      melodic: {
        ...key.melodic,
        ...getChords(["m", "m", "aug", "M", "M", "dim", "dim"], key.melodic.scale),
      },
    } as const;
    return obj;
  }

  const obj = {
    ...key,
    ...getChords(["M", "m", "m", "M", "M", "m", "dim"], key.scale),
  } as const;
  return obj;
}


export function getKeyChords(k : ReturnType<typeof keyInfo>) {
  if (k.type === "major") {
    return k.allPrimaryChordNames();
  }
  return [...k.natural.allPrimaryChordNames(), ...k.harmonic.allPrimaryChordNames(),...k.melodic.allPrimaryChordNames()]
} 
