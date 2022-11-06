import { isDev, writeToFile } from "./dev-utils";
import { allChordTypes, Log, loopQuiz } from "./utils";
import { WhichIsTheChordQuiz } from "./quizzes/whichIsTheChord";
import { MissingScaleNoteQuiz } from "./quizzes/missingScaleNote";
import { NameScaleDegreeQuiz } from "./quizzes/nameScaleDegree";
import { Quiz } from "./quiz-types";

if (isDev()) {
  writeToFile("./txt/chordTypes.txt", allChordTypes.join("\n"));
}

const quizzes: Quiz[] = [
  MissingScaleNoteQuiz,
  NameScaleDegreeQuiz,
  WhichIsTheChordQuiz
]

const quizIndex = Log.keyInSelect(quizzes.map(quiz => quiz.quizName), "Choose a quiz");

if (quizIndex !== -1) {
  loopQuiz(quizzes[quizIndex], quizzes[quizIndex].getAllOptions());
}

Log.write("Bye for now");

