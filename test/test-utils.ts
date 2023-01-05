import { Chord } from "@tonaljs/tonal";

export const chordDetect = (chordTones: string[]) => Chord.detect(chordTones, { assumePerfectFifth: true });