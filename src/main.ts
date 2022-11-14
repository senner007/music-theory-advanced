import { isDev, writeToFile } from "./dev-utils";
import { allChordTypes, exit, isInterrupt, LogAsync } from "./utils";
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

;(async () => {
  try {
    const choice = await LogAsync.questionInList(
      quizzes.map((quiz) => quiz.meta.name),
      "Choose a quiz"
    );
    const choiceSelection = quizzes.filter(q => q.meta.name === choice.question)[0];
    loopQuiz(choiceSelection);
  } catch(err) {
    if (isInterrupt(err)) {
      exit();
    }
  }
})();


