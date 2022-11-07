export interface IQuiz {
  quizHead: string[];
  questionOptions: string[];
  question: string;
  answer(guess: string): [boolean, string];
}
export interface QuizMeta {
  getAllOptions: string[];
  name: string;
  description: string;
}

export interface Quiz {
  new (options: string[]): IQuiz;
  meta : QuizMeta;
}

