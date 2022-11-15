import { isDev, writeToFile } from "./dev-utils";
import { allChordTypes, allScaleTypes, customExit, isInterrupt, Log} from "./utils";
import { IQuiz, Quiz } from "./quiz-types";
import { MissingScaleNote } from "./quiz/missingScaleNote";
import { WhichIsTheChord } from "./quiz/whichIsTheChord";
import { NameScaleDegree } from "./quiz/nameScaleDegree";
import { loopQuiz } from "./quizEngine/loopQuiz";
import { HearTetraChord } from "./quiz/hearTetraChord";
import { LogAsync } from "./utils/logAsync";

Log.clear();
if (isDev()) {
  writeToFile("./txt/chordTypes.txt", allChordTypes.join("\n"));
  writeToFile("./txt/scaleTypes.txt", allScaleTypes.join("\n"));
}

const quizzes: Quiz<IQuiz>[] = [MissingScaleNote, NameScaleDegree, WhichIsTheChord, HearTetraChord];

;(async () => {
  while(true) {
    try {
      const choice = await LogAsync.questionInList(
        quizzes.map((quiz) => quiz.meta.name),
        "Choose a quiz",
        "q"
      );
     
      const choiceSelection = quizzes.filter(q => q.meta.name === choice)[0];
      await loopQuiz(choiceSelection);
      Log.clear();
    } catch(err) {
      if (isInterrupt(err)) {
        customExit();
      }
    }
  }
 
})();


