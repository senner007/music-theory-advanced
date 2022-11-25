import { LogAsync } from "../../logger/logAsync";
import { LogTable } from "../../logger/logTable";
import { SolfegeMelody } from "../../solfege";
import { AudioQuizBase } from "./audioQuizBase";

export abstract class SingingQuizBase extends AudioQuizBase {
  get questionOptions() {
    return ["Right", "Wrong"];
  }

  feedback(choice: string) {
    return choice === "Right" ? "Well done!" : "Try again";
  }

  async callQuiz(): Promise<string | never> {
   
    LogTable.write(new SolfegeMelody([
        { note: "D3", duration: 2 },
        { note: "G3", duration: 1 },
        { note: "F#3", duration: 2 },
        { note: "G3", duration: 1 },
      ], "D"));

    try {
      const choice = await LogAsync.questionInListIndexedGlobalKeyHook(
        this.questionOptions,
        "Evaluation",
        "q",
        this.getAudio().map((la) => {
          return { value: la.message, key: la.keyboardKey };
        })
      );

      return choice;
    } catch (err) {
      throw err;
    }
  }
}
