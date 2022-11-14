import chalk from "chalk";
import { playMidi } from "./midiplay";
import { IQuiz, IQuizAudio, Quiz } from "./quiz-types";
import { Log } from "./utils";
import inquirer from 'inquirer';
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
InterruptedPrompt.fromAll(inquirer);

interface IChoices {
  key: string | number;
  value: string
}

async function textQuiz(quiz: IQuiz): Promise<null | string> {
  const index = Log.keyInSelect(quiz.questionOptions, quiz.question);

  if (index === -1) {
    return null;
  }

  return quiz.questionOptions[index];

}

async function audioQuiz(quiz: IQuizAudio): Promise<null | string> {
  const ac = new AbortController();
  playMidi(quiz.getAudio(), ac);

  const replayAudio = "REPLAY AUDIO < space >"; // change me! ... and color me!

  const choices: IChoices[] = quiz.questionOptions
    .map((q: string, index: number) => { return { key: index, value: q } as IChoices })
    .concat([{ key: "p", value: replayAudio }])

  let answer: { question: string } | null = null;

  try {
    answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'question',
        message: 'Which is correct?',
        choices: choices,
        interruptedKeyName: "space",
      }]);
  } catch (err) {
    if (err === InterruptedPrompt.EVENT_INTERRUPTED) {
      ac.abort();
      return null;
    }
  }

  const choice = answer?.question;
  ac.abort();
  if (choice === replayAudio) {
    return null;
  };
  return choice!;
}

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
