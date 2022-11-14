import inquirer from "inquirer";
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
InterruptedPrompt.fromAll(inquirer);

export interface IChoices {
    value: string
    original?: string
}

export class LogAsync {

    private static getOptions(questionOptions: string[]): IChoices[] {
        return questionOptions.map(q => { return { original: q, value: q } });
    }
    private static getOptionsIndexed(questionOptions: string[]): IChoices[] {
        return this.getOptions(questionOptions).map((o: IChoices, index: number) => {
            return { ...o, value: '(' + (index + 1) + ') ' + o.value }
        })
    }

    private static async getQuestions(options: IChoices[], question: string, interruptKey: string): Promise<string | never> {
        const quitValue = "(Esc) Quit";
        const choices: ({ value: string } | inquirer.Separator)[] =
            [
                ...options,
                new inquirer.Separator(),
                { value: quitValue }
            ];
        let answer: { question: string };
        try {
            answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'question',
                    message: question,
                    choices: choices,
                    interruptedKeyName: interruptKey,
                }]);
        } catch (err) {
            throw (err);
        }
        if (answer.question === quitValue) {
            throw (InterruptedPrompt.EVENT_INTERRUPTED)
        }
        return options.filter(c => c.value === answer?.question)[0].original!;
    }

    static async questionInList(questionOptions: string[], question: string, interruptKey: string): Promise<string | never> {
        const options = this.getOptions(questionOptions);
        return this.getQuestions(options, question, interruptKey);
    }

    static async questionInListIndexed(questionOptions: string[], question: string, interruptKey: string): Promise<string | never> {
        const options = this.getOptionsIndexed(questionOptions);
        return this.getQuestions(options, question, interruptKey);
    }
}