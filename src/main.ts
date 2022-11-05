import { isDev, writeToFile } from "./dev-utils";
// import { MissingScaleNoteQuiz } from "./missingScaleNote";
import { NameScaleDegreeQuiz } from "./nameScaleDegree";
import { allScaleTypes, loopQuiz } from "./utils";

if (isDev()) {
  writeToFile("scaleTypes.txt", allScaleTypes.join("\n"));
}

const options = [
  "major",
  "aeolian",
  "major pentatonic",
  "dorian",
  "phrygian",
  "lydian",
  "mixolydian",
  "locrian",
  "harmonic minor",
  "melodic minor",
];

loopQuiz(NameScaleDegreeQuiz, options);
