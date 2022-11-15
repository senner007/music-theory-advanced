import { IQuiz } from "../quiz-types";
import { LogAsync } from "../utils/logAsync";

export async function textQuiz(quiz: IQuiz): Promise<string | never> {
    try {
        const choice = await LogAsync.questionInListIndexed(
            quiz.questionOptions,
            quiz.question,
            "q"
        );
        return choice;

    } catch (err) {
        throw (err);
    }
}