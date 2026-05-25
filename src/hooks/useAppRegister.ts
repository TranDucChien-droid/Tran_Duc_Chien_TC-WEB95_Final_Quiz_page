import { useMutation } from "@tanstack/react-query";
import { register } from "@/services/auth.service";

export function useAppRegister() {
  return useMutation({
    mutationFn: register,
  });
}
