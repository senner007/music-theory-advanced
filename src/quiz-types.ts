export interface IQuiz {
  execute() : Promise<string | never>
  answer(guess: string): Readonly<[boolean, string]>;
  quizHead: Readonly<string[]>;
  cleanup() : Promise<void>
}

export interface Quiz {
  new (options: Readonly<string[]>): IQuiz;
  meta(): {
    getAllOptions: Readonly<string[]>;
    name: string;
    description: string;
  };
}
