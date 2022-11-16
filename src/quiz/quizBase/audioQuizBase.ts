import { LogAsync } from "../../logger/logAsync";
import { playMidi, INotePlay } from "../../midiplay";
import { QuizBase } from "./quizBase";

export abstract class AudioQuizBase extends QuizBase {

    ac;
    eventHandlerKey = "space";
    private eventhandlerAction = () => {
        this.ac.abort();
        this.ac = new AbortController();
        playMidi(this.getAudio(), this.ac);
    }

    private globalHookHandler = (_: any, key: any) => {
        if (key.name === this.eventHandlerKey) {
            this.eventhandlerAction();
        }
    }

    constructor(options: string[]) {
        super(options);
        this.ac = new AbortController();
    }

    abstract getAudio(): INotePlay[];

    async execute(): Promise<string | never> {

        this.eventhandlerAction();
        process.stdin.on('keypress', this.globalHookHandler);

        try {
            const choice = await LogAsync.questionInListIndexedGlobalKeyHook(
                this.questionOptions,
                "Choose the correct answer",
                "q",
                { value: "play audio", key: this.eventHandlerKey }
            );
            return choice;
        } catch (err) {
            throw (err);
        }
    }

    cleanup = async (): Promise<void> => {
        this.ac.abort();
        process.stdin.off('keypress', this.globalHookHandler);
    }
}
