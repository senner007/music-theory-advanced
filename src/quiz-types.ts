import { INotePlay } from "./midiplay";

export interface IQuiz {
  quizHead: string[];
  questionOptions: string[];
  question: string;
  answer(guess: string): [boolean, string];
}

export interface IQuizAudio extends IQuiz {
  getAudio(): INotePlay[];
}

export interface Quiz<T extends IQuiz> {
  new (options: string[]): T;
  meta: {
    getAllOptions: string[];
    name: string;
    description: string;
  };
}
