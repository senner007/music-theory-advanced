import { INotePlay } from "../midiplay";
import { IQuiz, Quiz } from "../quiz-types";
import { noteSingleAccidental } from "../utils";
import { SingingQuizBase } from "./quizBase/SingingQuizBase";

export const FunctionalHearing: Quiz<string> = class extends SingingQuizBase implements IQuiz {
  // @ts-ignore
  verifyOptions(steps: string[]): boolean {
    return true;
  }

  key: noteSingleAccidental;
  constructor(scaleTypes: Readonly<string[]>) {
    super(scaleTypes);
    this.key = "D";
  }

  get quizHead() {
    return [];
  }

  get question() {
    return "";
  }

  getAudio() {
    const audio: INotePlay[] = [
      { noteNames: ["D3"], duration: 1 },
      { noteNames: ["G3"], duration: 1 },
      { noteNames: ["F#3"], duration: 1 },
      { noteNames: ["G3"], duration: 1 },
      { noteNames: ["A3"], duration: 1 },
    ];
    return [{ audio: audio, keyboardKey: "space", onInit: false, channel: 1, message: "play audio" }];
  }

  static meta() {
    return {
      get getAllOptions() {
        return ["Mi"];
      },
      name: "Sing functional degrees",
      description: "Sing the solfege degrees outlined in the table below",
    };
  }
};
