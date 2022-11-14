import inquirer from "inquirer";
import { playMidi } from "../midiplay";
import { IQuizAudio } from "../quiz-types";
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
InterruptedPrompt.fromAll(inquirer);
import chalk from "chalk";
import { IChoices } from "../utils/logAsync";


export async function audioQuiz(quiz: IQuizAudio): Promise<null | string> {
    const ac = new AbortController();
    playMidi(quiz.getAudio(), ac);

    const playAudioChalk = chalk.bold("(space) Play audio"); // change me! ... and color me!

    const choicesQuestions: IChoices[] = quiz.questionOptions
        .map((q: string, index: number) => { return { original  : q, value: '(' + index + ') ' + q } });

    const choices: (IChoices | inquirer.Separator)[] =
        [
            ...choicesQuestions,
            new inquirer.Separator(),
            { value: playAudioChalk }
        ];
    

    let answer: { question: string } | null = null;

    try {
        answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'question',
                message: quiz.question,
                choices: choices,
                interruptedKeyName: "space",
            }]);
    } catch (err) {
        if (err === InterruptedPrompt.EVENT_INTERRUPTED) {
            ac.abort();
            return null;
        }
    }

    ac.abort();
    if (answer?.question === playAudioChalk) {
        return null;
    };
    return choicesQuestions.filter(c => c.value === answer?.question)[0].original!;
}