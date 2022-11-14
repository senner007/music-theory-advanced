import chalk from "chalk";
import { IQuiz, IQuizAudio, Quiz } from "../quiz-types";
import { Log } from "../utils";
import inquirer from 'inquirer';
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
import { textQuiz } from "./textQuiz";
import { audioQuiz } from "./audioQuiz";


async function getQuiz(quiz: IQuiz | IQuizAudio) {
  if ("getAudio" in quiz) {
    return await audioQuiz(quiz as IQuizAudio)
  }
  return textQuiz(quiz)
}

export function loopQuiz(QuizClass: Quiz<IQuiz | IQuizAudio>) {
  ; (async () => {

    const options = QuizClass.meta.getAllOptions;
    let quiz = new QuizClass(options);

    while (true) {

      Log.clear();
      Log.write(QuizClass.meta.description);

      for (const head of quiz.quizHead) {
        Log.write(head);
      }

      const choice = await getQuiz(quiz);
      if (choice === null) {
        continue;
      }

      const [isCorrect, correctAnswer] = quiz.answer(choice as string);

      if (isCorrect) {
        Log.write(chalk.green(`Right!`));
      } else {
        Log.write(chalk.red(`Wrong! Don't guess`));
        Log.write(chalk.white(`Correct : ${correctAnswer}`));
      }

      try {
        await inquirer.prompt([
          {
            name: 'continueorquit',
            message: 'Press to continue or Esc to quit'
          }]);
      } catch (err) {
        if (err === InterruptedPrompt.EVENT_INTERRUPTED) {
          Log.write("\nBye for now");
          break;
        }
      }
      quiz = new QuizClass(options);
    }

  })();
}
