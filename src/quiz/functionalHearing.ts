
import { IQuiz, Quiz } from "../quiz-types";
import { SingingQuizBase } from "./quizBase/SingingQuizBase";

export const FunctionalHearing: Quiz<string> = class extends SingingQuizBase implements IQuiz {
   // @ts-ignore 
  verifyOptions(steps: string[]): boolean {
    // return steps.every((step) => allChromaticSteps.includes(step));
    return true;
  }

  octaveAudio = 4;
  constructor(scaleTypes: Readonly<string[]>) {
    super(scaleTypes);
   
  }

  get quizHead() {
    return [];
  }

  get question() {
    return "Which note is missing?";
  }


  getAudio() {
    return [ 
    ]
  }

  static meta() {
    return {
      get getAllOptions() {
        return [
            "Mi"
        ];
      },
      name: "Sing functional degrees",
      description: "Sing the solfege degrees outlined in the table below",
    };
  }
};
