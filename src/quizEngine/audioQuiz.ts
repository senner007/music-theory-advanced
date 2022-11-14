import inquirer from "inquirer";
import { playMidi } from "../midiplay";
import { IQuizAudio } from "../quiz-types";
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
InterruptedPrompt.fromAll(inquirer);

interface IChoices {
    key: string | number;
    value: string
}

export async function audioQuiz(quiz: IQuizAudio): Promise<null | string> {
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

    const choice = answer?.question;
    ac.abort();
    if (choice === replayAudio) {
        return null;
    };
    return choice!;
}