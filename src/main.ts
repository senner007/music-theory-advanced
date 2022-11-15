import { isDev, writeToFile } from "./dev-utils";
import { allChordTypes, allScaleTypes, customExit, isInterrupt} from "./utils";
import { IQuiz, Quiz } from "./quiz-types";
import { MissingScaleNote } from "./quiz/missingScaleNote";
import { WhichIsTheChord } from "./quiz/whichIsTheChord";
import { NameScaleDegree } from "./quiz/nameScaleDegree";
import { loopQuiz } from "./quizEngine/loopQuiz";
import { HearTetraChord } from "./quiz/hearTetraChord";
import { LogAsync } from "./utils/logAsync";

if (isDev()) {
  writeToFile("./txt/chordTypes.txt", allChordTypes.join("\n"));
  writeToFile("./txt/scaleTypes.txt", allScaleTypes.join("\n"));
}

const quizzes: Quiz<IQuiz>[] = [MissingScaleNote, NameScaleDegree, WhichIsTheChord, HearTetraChord];

;(async () => {
  try {
    const choice = await LogAsync.questionInList(
      quizzes.map((quiz) => quiz.meta.name),
      "Choose a quiz",
      "escape"
    );
   
    const choiceSelection = quizzes.filter(q => q.meta.name === choice)[0];
    loopQuiz(choiceSelection);
  } catch(err) {
    if (isInterrupt(err)) {
      customExit();
    }
  }
})();


