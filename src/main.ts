import { isDev, writeToFile } from "./dev-utils";
import { allChordTypes, allScaleTypes, customExit, isInterrupt } from "./utils";
import { Quiz } from "./quiz-types";
import { MissingScaleNote } from "./quiz/missingScaleNote";
import { WhichIsTheChord } from "./quiz/whichIsTheChord";
import { NameScaleDegree } from "./quiz/nameScaleDegree";
import { loopQuiz } from "./quizEngine/loopQuiz";
import { HearTetraChord } from "./quiz/hearTetraChord";
import { LogAsync } from "./logger/logAsync";
import easymidi from "easymidi";
import { Log } from "./logger/logSync";
import { HearScales } from "./quiz/hearScales";
import { Hear12thTone } from "./quiz/hear12thTone";
import { HearTrichordPitchPatterns } from "./quiz/hearTrichordPitchPattern";
import { SingingFunctionalDegrees } from "./quiz/singingFunctionDegrees";
import { SingingHarmony } from "./quiz/SingingHarmony";

Log.clear();

Log.write("Found MIDI outputs:");
for (const mididevice of easymidi.getOutputs()) {
  Log.success(mididevice);
}
if (isDev()) {
  writeToFile("./txt/chordTypes.txt", allChordTypes.join("\n"));
  writeToFile("./txt/scaleTypes.txt", allScaleTypes.join("\n"));
}

const quizzes: Quiz<any>[] = [
  MissingScaleNote,
  NameScaleDegree,
  WhichIsTheChord,
  HearTetraChord,
  HearScales,
  Hear12thTone,
  HearTrichordPitchPatterns,
  SingingFunctionalDegrees,
  SingingHarmony
];

(async () => {
  while (true) {
    try {
      
      const choice = await LogAsync.questionInList(
        quizzes.map((quiz) => quiz.meta().name),
        "Choose a quiz",
        "q"
      );

      const choiceSelection = quizzes.filter((q) => q.meta().name === choice)[0];
      await loopQuiz(choiceSelection);
      Log.clear();
    } catch (err) {
      if (isInterrupt(err)) {
        customExit();
      }
    }
  }
})();
