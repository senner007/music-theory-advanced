import { LogError } from "../../dev-utils";
import { Quiz } from "../../quiz-types";

export abstract class QuizBase {
  constructor(options: string[]) {
    this.errorHandleOptions(options);
  }

  private errorHandleOptions(options: string[]): void | never {
    const optionsAreValid = this.verifyOptions(options);
    const quizConstructor: Quiz = this.constructor as Quiz;
    if (!optionsAreValid) LogError("options invalid in class: " + "'" + quizConstructor.meta.name + "'");
  }

  protected abstract verifyOptions(options: string[]): boolean;
  abstract execute(): Promise<string | never>;
  abstract questionOptions: string[];
  abstract question: string;
  abstract cleanup(): Promise<void>

}