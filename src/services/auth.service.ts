import { api } from "./api";

export type AuthResponse = {
  token: string;
  user: { id: string; email: string; role: string; createdAt?: string };
};

export const login = async (payload: { email: string; password: string }) => {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
};

export const register = async (payload: { email: string; password: string }) => {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
};
