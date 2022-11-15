import chalk from "chalk";
import { IQuiz, IQuizAudio, Quiz } from "../quiz-types";
import inquirer from 'inquirer';
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
import { textQuiz } from "./textQuiz";
import { audioQuiz } from "./audioQuiz";
import { Log } from "../logger/logSync";

async function getQuiz(quiz: IQuiz | IQuizAudio) {
  if ("getAudio" in quiz) {
    return await audioQuiz(quiz as IQuizAudio)
  }
  return textQuiz(quiz)
}

export async function loopQuiz(QuizClass: Quiz<IQuiz | IQuizAudio>) {


    const options = QuizClass.meta.getAllOptions;
    let quiz = new QuizClass(options);

    while (true) {

      Log.clear();
      Log.write(QuizClass.meta.description);

      for (const head of quiz.quizHead) {
        Log.write(head);
      }

      let choice;
      try {
        choice = await getQuiz(quiz);
      } catch (err) {
        break;
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
            message: 'Press to continue or q to quit',
            interruptedKeyName: "q"
          }]);
      } catch (err) {
        break;
      }
      quiz = new QuizClass(options);
    }

}
