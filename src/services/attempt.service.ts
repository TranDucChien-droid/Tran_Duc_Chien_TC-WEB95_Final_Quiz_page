import type { AttemptRow, SubmitAttemptResult } from "@/types";
import { api } from "./api";

export type AttemptAnswerPayload = {
  questionId: string;
  selectedIndexes: number[];
};

export const submitAttempt = async (payload: { quizId: string; answers: AttemptAnswerPayload[] }) => {
  const { data } = await api.post<SubmitAttemptResult>("/attempts", payload);
  return data;
};

export const getMyAttempts = async () => {
  const { data } = await api.get<AttemptRow[]>("/attempts/me");
  return data;
};
