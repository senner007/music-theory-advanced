import { IQuiz } from "../quiz-types";
import { Log } from "../utils";

export async function textQuiz(quiz: IQuiz): Promise<null | string> {
    const index = Log.keyInSelect(quiz.questionOptions, quiz.question);

    if (index === -1) {
        return null;
    }

    return quiz.questionOptions[index];
}