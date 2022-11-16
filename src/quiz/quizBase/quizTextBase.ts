import { LogAsync } from "../../logger/logAsync";
import { QuizBase } from "./quizBase";

export abstract class TextQuizBase extends QuizBase {
    constructor(options: string[]) {
        super(options);
    }

    async execute(): Promise<string | never> {
        const choice = await LogAsync.questionInListIndexed(
            this.questionOptions,
            this.question,
            "q"
        );

        return choice;
    }

    async cleanup(): Promise<void> {
        return;
    }
}


