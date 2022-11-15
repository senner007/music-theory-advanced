import { playMidi } from "../midiplay";
import { IQuizAudio } from "../quiz-types";
import { LogAsync } from "../utils/logAsync";

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
          "q",
          { value : "play audio", key: eventHandlerKey }
        );
        return choice;
      } catch(err) { 
        throw(err);
      } finally {
        ac.abort();
        process.stdin.off('keypress', globalHookHandler); 
      }
}