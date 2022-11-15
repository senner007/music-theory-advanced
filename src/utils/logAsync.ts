import chalk from "chalk";
import inquirer from "inquirer";
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";

InterruptedPrompt.fromAll(inquirer);

export interface IOptions {
    value: string
}

export interface IOptionsIndexed extends IOptions {
    name: string
}

export interface IGlobalHook {
    value: string;
    key: string;
}

interface IChoices {
    options: (IOptions | IOptionsIndexed)[];
    separator: inquirer.Separator;
    interrupt: IOptions,
}

class LogAsyncUtil {

    protected static getOptions(questionOptions: string[]): IOptions[] {
        return questionOptions.map(q => { return { value: q } });
    }

    protected static getOptionsIndexed(questionOptions: string[]): IOptionsIndexed[] {
        return this.getOptions(questionOptions).map((o: IOptions, index: number) => {
            return { value: o.value, name: '(' + (index + 1) + ') ' + o.value }
        })
    }

    protected static addSeparators(questionOptions: (IOptions | IOptionsIndexed)[], interruptKey: string): IChoices {
        const quitValue = `(${interruptKey}) Quit`;
        const choices: IChoices =
        {
            options: questionOptions,
            separator: new inquirer.Separator(),
            interrupt: { value: quitValue }
        };
        return choices;
    }

    protected static async getQuestions(choices: IChoices, question: string, interruptKey: string): Promise<string | never> {

        try {
            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'question',
                    message: question,
                    choices: [...choices.options, choices.separator, choices.interrupt],
                    pageSize: 10,
                    interruptedKeyName: interruptKey,
                }]);
                
            if (answer.question === choices.interrupt.value) {
                throw (InterruptedPrompt.EVENT_INTERRUPTED)
            }

            return choices.options.filter(c => c.value === answer?.question)[0].value;
        } catch (err) {
            throw (err);
        }
    }
}

export class LogAsync extends LogAsyncUtil {

    static async questionInList(questionOptions: string[], question: string, interruptKey: string): Promise<string | never> {
        const options = this.getOptions(questionOptions);
        return this.getQuestions(this.addSeparators(options, interruptKey), question, interruptKey);
    }

    static async questionInListIndexed(questionOptions: string[], question: string, interruptKey: string): Promise<string | never> {
        const options = this.getOptionsIndexed(questionOptions);
        return this.getQuestions(this.addSeparators(options, interruptKey), question, interruptKey);
    }

    static async questionInListIndexedGlobalKeyHook(questionOptions: string[], question: string, interruptKey: string, globalHook: IGlobalHook): Promise<string | never> {
        const options = this.getOptionsIndexed(questionOptions);
        const questionWithHook = question + chalk.bgWhite("\n  Press: " + globalHook.key + " to " + globalHook.value + " "); // beautify me! 
        return this.getQuestions(this.addSeparators(options, interruptKey), questionWithHook, interruptKey);
    }
}