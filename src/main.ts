import { isDev, writeToFile } from "./dev-utils";
import { allChordTypes, Log, loopQuiz } from "./utils";
import { Quiz } from "./quiz-types";
import { MissingScaleNote } from "./quizzes/missingScaleNote";
import { WhichIsTheChord } from "./quizzes/whichIsTheChord";
import { NameScaleDegree } from "./quizzes/nameScaleDegree";

if (isDev()) {
  writeToFile("./txt/chordTypes.txt", allChordTypes.join("\n"));
}

const quizzes: Quiz[] = [MissingScaleNote, NameScaleDegree, WhichIsTheChord];

const quizIndex = Log.keyInSelect(
  quizzes.map((quiz) => quiz.meta.name),
  "Choose a quiz"
);

if (quizIndex !== -1) {
  loopQuiz(quizzes[quizIndex]);
}

Log.write("Bye for now");
