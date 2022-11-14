import { IQuiz } from "../quiz-types";
import { exit, isInterrupt} from "../utils";
import { LogAsync } from "../utils/logAsync";

export async function textQuiz(quiz: IQuiz): Promise<string | never> {
    try {
        const choice = await LogAsync.questionInListIndexed(
            quiz.questionOptions,
            quiz.question,
            "escape"
        );
        return choice;

    } catch (err) {
        if (isInterrupt(err)) {
            exit();
        }
        throw (err);
    }
}