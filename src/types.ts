export interface Question {
  question: string;
  options: string[];
}

export interface QuizData {
  questions: Question[];
  answers: string[];
  settings: QuizSettings;
}

export interface QuizSettings {
  showAnswersAtEnd: boolean;
  questionCount: number;
  randomOrder: boolean;
}