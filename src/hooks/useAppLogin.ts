import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth.service";

export function useAppLogin() {
  return useMutation({
    mutationFn: login,
  });
}
