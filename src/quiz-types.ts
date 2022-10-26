export interface IQuiz {
    quizHead: string[];
    questionOptions: string[];
    question: string;
    answer: string;
}
  
export interface Quiz {
      new(options: string[]): IQuiz
}