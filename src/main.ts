import { isDev, writeToFile } from "./dev-utils";
import { allChordTypes, Log } from "./utils";
import { IQuiz, Quiz } from "./quiz-types";
import { MissingScaleNote } from "./quizzes/missingScaleNote";
import { WhichIsTheChord } from "./quizzes/whichIsTheChord";
import { NameScaleDegree } from "./quizzes/nameScaleDegree";
import { loopQuiz } from "./quizEngine/loopQuiz";
import { HearTetraChord } from "./quizzes/hearTetraChord";

if (isDev()) {
  writeToFile("./txt/chordTypes.txt", allChordTypes.join("\n"));
}

const quizzes: Quiz<IQuiz>[] = [MissingScaleNote, NameScaleDegree, WhichIsTheChord, HearTetraChord];

const quizIndex = Log.keyInSelect(
  quizzes.map((quiz) => quiz.meta.name),
  "Choose a quiz"
);

if (quizIndex !== -1) {
  loopQuiz(quizzes[quizIndex]);
}


