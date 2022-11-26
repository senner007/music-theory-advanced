import { playMidi, INotePlay } from "../../midiplay";
import { IListener, QuizBase } from "./quizBase";

interface IAudioPlay {
  audio: INotePlay[];
  keyboardKey: string;
  onInit: boolean;
  channel: number;
  message: string;
}

export abstract class AudioQuizBase extends QuizBase {
  protected tempo: number = 500;

  constructor(options: Readonly<any[]>) {
    super(options);
  }

  private createListeners(audioParts: IAudioPlay[]): IListener[] {
    return audioParts.map((audioPart) => {
      let acObj = { ac: new AbortController() };
      let timerObj: any;

      const listener = (_: any, key: any) => {
        if (key.name === audioPart.keyboardKey) {
          acObj.ac.abort();
          acObj.ac = new AbortController();
          const channel = audioPart.channel ?? 1;
          playMidi(audioPart.audio, acObj.ac, channel, timerObj, this.tempo);
        }
      };
      return {
        keyName: audioPart.keyboardKey,
        listener: listener,
        acObj: acObj,
      };
    });
  }

  abstract getAudio(): IAudioPlay[];

  private setAudioListeners() {
    this.listenersArray.push(...this.createListeners(this.getAudio()));
    this.attachHandlers(this.listenersArray);
    this.getAudio().forEach((audioPart) => {
      if (audioPart.onInit) {
        process.stdin.emit("keypress", null, { name: audioPart.keyboardKey });
      }
    });
  }

  abstract callQuiz(): Promise<string | never>;

  async execute(): Promise<string | never> {
    this.setAudioListeners();
    return await this.callQuiz();
  }
}
