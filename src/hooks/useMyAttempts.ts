import { useQuery } from "@tanstack/react-query";
import { attemptKeys } from "@/queryKeys/attemptKeys";
import { getMyAttempts } from "@/services/attempt.service";

export function useMyAttempts() {
  return useQuery({
    queryKey: attemptKeys.me(),
    queryFn: getMyAttempts,
    staleTime: 1000 * 60 * 2,
  });
}
