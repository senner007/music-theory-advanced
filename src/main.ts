import { isDev, writeToFile } from "./dev-utils";
// import { MissingScaleNoteQuiz } from "./missingScaleNote";
// import { NameScaleDegreeQuiz } from "./nameScaleDegree";
import { allChordTypes, loopQuiz } from "./utils";
import { WhichIsTheChordQuiz } from "./quizzes/whichIsTheChord";

if (isDev()) {
  writeToFile("./txt/chordTypes.txt", allChordTypes.join("\n"));
}

const options = [
  "major",
  "minor"
];

loopQuiz(WhichIsTheChordQuiz, options);
