export interface IQuiz {
  execute() : Promise<string | never>
  answer(guess: string): [boolean, string];
  quizHead: string[];
  cleanup() : Promise<void>
}

export interface Quiz {
  new (options: string[]): IQuiz;
  meta(): {
    getAllOptions: string[];
    name: string;
    description: string;
  };
}
