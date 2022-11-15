import inquirer from "inquirer";
import { playMidi } from "../midiplay";
import { IQuizAudio } from "../quiz-types";
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
InterruptedPrompt.fromAll(inquirer);
import { LogAsync } from "../utils/logAsync";
import { exit, isInterrupt } from "../utils";


export async function audioQuiz(quiz: IQuizAudio): Promise<string |never> {
    
    let ac = new AbortController();
    eventhandlerAction();
    const eventHandlerKey = "space";
    function globalHookHandler (_: any, key: any) {
        if (key.name === eventHandlerKey) {
            eventhandlerAction();
        }
    }

    function eventhandlerAction() {
        ac.abort();
        ac = new AbortController();
        playMidi(quiz.getAudio(), ac);
    }

    process.stdin.on('keypress', globalHookHandler);

    try {
        const choice = await LogAsync.questionInListIndexedGlobalKeyHook(
            quiz.questionOptions,
          "Choose the correct answer",
          "escape",
          { value : "play audio", key: eventHandlerKey }
        );
        return choice;

      } catch(err) {
        if (isInterrupt(err)) {
          exit();
        }
        throw(err);
      } finally {
        ac.abort();
        process.stdin.off('keypress', globalHookHandler); 
      }
}