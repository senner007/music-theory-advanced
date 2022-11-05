export interface IQuiz {
  quizHead: string[];
  questionOptions: string[] | string[][];
  question: string;
  answer: string | string[];
}

export interface Quiz {
  new (options: string[]): IQuiz;
}