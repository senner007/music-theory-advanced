import { LogError } from "./dev-utils";

export abstract class QuizBase {
    constructor (options : string[]) {
        this.errorHandleOptions(options);
    }

    private errorHandleOptions(options: string[]): void {
        const optionsAreValid =   this.verifyOptions(options);
        const className = this.constructor.name;
        if (!optionsAreValid) LogError("options invalid in class" + className)
    }
    
    abstract verifyOptions(options: string[]): boolean;
}