import { LogAsync } from "../../logger/logAsync";
import { playMidi, INotePlay } from "../../midiplay";
import { QuizBase } from "./quizBase";


interface IAudioPlay {
    audio:INotePlay[]
    audioHandler: string;
    onInit : boolean;
}

interface IListener {
    keyName: string, 
    listener : (_: any, key: any) => void;
    acObj : AbortController
}

export abstract class AudioQuizBase extends QuizBase {

    listenersArray : IListener[] = [];

    constructor(options: Readonly<string[]>) {
        super(options);
    }

    private attachHandlers(listeners:  IListener[]) {
        for (const listener of listeners) {
            process.stdin.on("keypress", listener.listener);
        }
    }

    private detachHandlers(listeners:  IListener[]) {
        for (const listener of listeners) {
            listener.acObj.abort();
            process.stdin.off("keypress", listener.listener);
        }
    }

    private createHandlers(handlerKeys: IAudioPlay[]) : IListener[] {
        return handlerKeys.map(handlerKey => {
            let acObj = new AbortController()

            const listener =  (_: any, key: any) => {
                console.log("key press")
                if (key.name === handlerKey.audioHandler) {
                    acObj.abort();
                    console.log("new abort controller" + new Date())
                    acObj = new AbortController();
                    playMidi(handlerKey.audio, acObj); 
                }
            }
            return {
                keyName : handlerKey.audioHandler,
                listener : listener,
                acObj : acObj
            }
        });
    }

    abstract getAudio(): IAudioPlay[];

    async execute(): Promise<string | never> {
        this.listenersArray = this.createHandlers(this.getAudio());
        this.attachHandlers(this.listenersArray)
        process.stdin.emit('keypress', null, {name: 'space'});

        try {
            const choice = await LogAsync.questionInListIndexedGlobalKeyHook(
                this.questionOptions,
                "Choose the correct answer", 
                "q",
                { value: "play audio", key: "space" } // accept array instead
            );
            return choice;
        } catch (err) {
            throw (err);
        }
    }

    cleanup = async (): Promise<void> => {
        this.detachHandlers(this.listenersArray);
    }
}
