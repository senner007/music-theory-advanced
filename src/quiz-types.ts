export interface IQuiz {
  execute() : Promise<string | never>
  feedback(choice: string): string;
  quizHead: Readonly<string[]>;
  cleanup() : Promise<void>
}

export interface Quiz<T> {
  new (options: Readonly<T[]>): IQuiz;
  meta(): {
    getAllOptions: Readonly<string[]>;
    name: string;
    description: string;
  };
}
