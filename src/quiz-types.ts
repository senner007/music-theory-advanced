export interface IQuiz {
  quizHead: string[];
  questionOptions: string[] | string[][];
  question: string;
  answer: string | string[];
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

