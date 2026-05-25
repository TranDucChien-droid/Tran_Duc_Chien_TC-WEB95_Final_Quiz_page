import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attemptKeys } from "@/queryKeys/attemptKeys";
import { submitAttempt, type AttemptAnswerPayload } from "@/services/attempt.service";

export function useSubmitAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { quizId: string; answers: AttemptAnswerPayload[] }) => submitAttempt(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: attemptKeys.all });
    },
  });
}
