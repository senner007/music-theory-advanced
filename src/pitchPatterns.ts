import { noteAllAccidental } from "./utils";
import { Interval, Note } from "@tonaljs/tonal";

type semitones = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type pattern = [semitones, semitones, semitones];

export type pitchPatternName =
    "013" |
    "014" |
    "015" |
    "016" |
    "024" |
    "025" |
    "026" |
    "027" |
    "036" |
    "037" |
    "048";

type pitchPattern = Record<pitchPatternName, pattern>;

export const pitchPatterns: pitchPattern = {
    "013": [0, 1, 3],
    "014": [0, 1, 4],
    "015": [0, 1, 5],
    "016": [0, 1, 6],
    "024": [0, 2, 4],
    "025": [0, 2, 5],
    "026": [0, 2, 6],
    "027": [0, 2, 7],
    "036": [0, 3, 6],
    "037": [0, 3, 7],
    "048": [0, 4, 8],
};

export function getPattern(patternName : pitchPatternName) {
    return pitchPatterns[patternName];
}


export function getPatternIntervals(pattern: pattern): [string, string] {
    return [Interval.fromSemitones(pattern[1]), Interval.fromSemitones(pattern[2] - pattern[1])]
}

export function getPitchPatternInversions(note: noteAllAccidental, intervals : [string, string]) {
    const note2 = Note.transpose(note, intervals[0]);
    const note3 = Note.transpose(note2, intervals[1]);

    const note2Inversion = Note.transpose(note, intervals[1]);

    return [
        [note, note2, note3],
        [note, note2Inversion, note3]
    ]
}
