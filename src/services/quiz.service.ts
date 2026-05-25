import type { Quiz, QuizDetail } from "@/types";
import { api } from "./api";

export const getQuizzes = async () => {
  const { data } = await api.get<Quiz[]>("/quizzes");
  return data;
};

export const getQuizDetail = async (id: string) => {
  const { data } = await api.get<QuizDetail>(`/quizzes/${id}`);
  return data;
};
