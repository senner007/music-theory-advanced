import { noteVariant } from "./utils";
import { Interval, Note } from "@tonaljs/tonal";

type semitones = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type pattern = [semitones, semitones, semitones];

type pitchPatternName =
    "013" |
    "014" |
    "015" |
    "016" |
    "017" |
    "024" |
    "025" |
    "026" |
    "027" |
    "036" |
    "037" |
    "038";

type pitchPattern = Record<pitchPatternName, pattern>;

export const pitchPatterns: pitchPattern = {
    "013": [0, 1, 3],
    "014": [0, 1, 4],
    "015": [0, 1, 5],
    "016": [0, 1, 6],
    "017": [0, 1, 7],
    "024": [0, 2, 4],
    "025": [0, 2, 5],
    "026": [0, 2, 6],
    "027": [0, 2, 7],
    "036": [0, 3, 6],
    "037": [0, 3, 7],
    "038": [0, 3, 8],
};


export function getPatternIntervals(patternName: pitchPatternName): [string, string] {

    const pattern = pitchPatterns[patternName] as pattern;
    return [Interval.fromSemitones(pattern[1]), Interval.fromSemitones(pattern[2] - pattern[1])]
}

export function getPitchPattern(note: noteVariant, intervals : [string, string]) {
    return [Note.transpose(note, intervals[0]), Note.transpose(note, intervals[1])]
}