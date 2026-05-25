import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAppRegister } from "@/hooks/useAppRegister";
import { setToken } from "@/services/api";

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const register = useAppRegister();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await register.mutateAsync({ email, password });
      setToken(data.token);
      await navigate({ to: "/" });
    } catch {
      // API errors are shown via toast in the axios interceptor
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <h1 className="mb-6 text-center text-2xl font-semibold">{t("register")}</h1>
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{t("email")}</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{t("password")}</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" fullWidth loading={register.isPending}>
          {register.isPending ? t("registering") : t("register")}
        </Button>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          <Link to="/login" className="text-teal-700 underline dark:text-teal-400">
            {t("login")}
          </Link>
        </p>
      </form>
    </div>
  );
}

