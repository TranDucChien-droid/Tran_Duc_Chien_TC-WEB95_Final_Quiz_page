export type Quiz = {
  _id: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: string;
};

export type Question = {
  _id: string;
  quizId: string;
  question: string;
  type: "single" | "multiple";
  options: string[];
};

export type QuizDetail = Quiz & { questions: Question[] };

export type AttemptAnswerDetail = {
  questionId: string;
  selectedIndexes: number[];
  question?: string;
  type?: "single" | "multiple";
  options?: string[];
  selectedLabels?: string[];
  correctIndexes?: number[];
  correctLabels?: string[];
  isCorrect?: boolean;
};

export type AttemptRow = {
  _id: string;
  quizId: { _id: string; title: string } | string;
  score: number;
  createdAt: string;
  answers?: AttemptAnswerDetail[];
};

export type SubmitAttemptResult = {
  attemptId: string;
  score: number;
  correct: number;
  total: number;
  createdAt: string;
  answers?: AttemptAnswerDetail[];
};
