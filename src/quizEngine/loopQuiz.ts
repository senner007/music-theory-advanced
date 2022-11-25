import { Quiz } from "../quiz-types";
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
import { Log } from "../logger/logSync";
import { LogAsync } from "../logger/logAsync";

export async function loopQuiz(QuizClass: Quiz<any>) {

  const options = QuizClass.meta().getAllOptions;

  while (true) {

    const quiz = new QuizClass(options);

    Log.clear();
    Log.write(QuizClass.meta().description);

    for (const head of quiz.quizHead) {
      Log.write(head);
    }

    let choice;
    try {
      choice = await quiz.execute();
    } catch (err) {
      await quiz.cleanup();
      break;

    }

    Log.write(quiz.feedback(choice));

 
    try {
      await LogAsync.questionInList(
        ["Continue"],
        "Continue or Quit",
        "q"
      );
    } catch (err) {
      break;
    } finally {
      await quiz.cleanup();
    }
  }
}
