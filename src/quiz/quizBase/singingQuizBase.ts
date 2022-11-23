import { LogAsync } from "../../logger/logAsync";
import { LogTable } from "../../logger/logTable";
import { AudioQuizBase } from "./audioQuizBase";

export abstract class SingingQuizBase extends AudioQuizBase {

    get questionOptions() {
        return ["Right", "Wrong"]
    }

    feedback(choice: string) {
        return choice === "Right" ? "Well done!" : "Try again";
    }

    async callQuiz():  Promise<string | never> {
        LogTable.write("table")
        try {
            const choice = await LogAsync.questionInListIndexedGlobalKeyHook(
                this.questionOptions,
                "Evaluation", 
                "q",
                this.getAudio().map(la => {
                    return { value: la.message, key: la.keyboardKey } 
                })
            );
           
            return choice;
        } catch (err) {
            throw (err);
        }
    }
}
