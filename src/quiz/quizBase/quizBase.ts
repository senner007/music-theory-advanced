import { LogError } from "../../dev-utils";
import { Quiz } from "../../quiz-types";

export abstract class QuizBase {
  constructor(options: Readonly<string[]>) {
    this.errorHandleOptions(options);
  }

  private errorHandleOptions(options: Readonly<string[]>): void | never {
    const optionsAreValid = this.verifyOptions(options);
    const quizConstructor: Quiz = this.constructor as Quiz;
    if (!optionsAreValid) LogError("options invalid in class: " + "'" + quizConstructor.meta.name + "'");
  }

  protected abstract verifyOptions(options: Readonly<string[]>): boolean;
  abstract questionOptions: Readonly<string[]>;
  abstract question: string;
}