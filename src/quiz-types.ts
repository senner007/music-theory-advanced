export interface IQuiz {
    quizHead: string[];
    question: string[];
    answer: string;
}
  
export interface Quiz {
      new(): IQuiz
}