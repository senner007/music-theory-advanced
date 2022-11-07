import chalk from "chalk";
import { Quiz } from "./quiz-types";
import { Log } from "./utils";

export function loopQuiz(QuizClass: Quiz) {
    while (true) {
      Log.clear();
      Log.write(QuizClass.meta.description);
      const options = QuizClass.meta.getAllOptions;
      const quiz = new QuizClass(options);
  
      for (const head of quiz.quizHead) {
        Log.write(head);
      }
  
      const index = Log.keyInSelect(quiz.questionOptions, quiz.question);
  
      if (index === -1) {
        break;
      }
  
      const choice = quiz.questionOptions[index];
      const [isCorrect, answer] = quiz.answer(choice);
  
      if (isCorrect) {
        Log.write(chalk.green(`Right!`));
      } else {
        Log.write(chalk.red(`Wrong! Don't guess`));
        Log.write(chalk.white(`Correct : ${answer}`));
      }
  
      Log.continue("Hit Enter key to continue");
    }
  }
  