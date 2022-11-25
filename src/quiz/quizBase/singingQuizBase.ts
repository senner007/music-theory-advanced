import { LogAsync } from "../../logger/logAsync";
import { LogTable } from "../../logger/logTable";
import { SolfegeMelody } from "../../solfege";
import { noteSingleAccidental } from "../../utils";
import { AudioQuizBase } from "./audioQuizBase";

export abstract class SingingQuizBase extends AudioQuizBase {
  get questionOptions() {
    return ["Right", "Wrong"];
  }

  abstract key: noteSingleAccidental;

  feedback(choice: string) {
    return choice === "Right" ? "Well done!" : "Try again";
  }

  async callQuiz(): Promise<string | never> {
   
    LogTable.write(new SolfegeMelody(this.getAudio()[0].audio, this.key));

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
