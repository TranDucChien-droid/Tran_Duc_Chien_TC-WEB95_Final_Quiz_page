import { Link, Outlet, useRouter } from "@tanstack/react-router";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { useTheme } from "@/store/hooks";
import { setToken } from "@/services/api";

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const isVi = i18n.language.startsWith("vi");

  function logout() {
    setToken(null);
    void router.navigate({ to: "/login" });
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-teal-700 dark:text-teal-400">
            {t("appTitle")}
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link to="/" className="rounded-md px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
              {t("quizzes")}
            </Link>
            <Link to="/attempts" className="rounded-md px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
              {t("myAttempts")}
            </Link>
            <div
              className="inline-flex rounded-md border border-slate-300 p-0.5 dark:border-slate-600"
              role="group"
              aria-label={t("language")}
            >
              {(["en", "vi"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => void i18n.changeLanguage(lang)}
                  className={clsx(
                    "rounded px-2.5 py-1 text-sm font-medium transition",
                    (lang === "vi") === isVi
                      ? "bg-teal-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={toggle}>
              {theme === "dark" ? t("lightMode") : t("darkMode")}
            </Button>
            <Button variant="dark" onClick={logout}>
              {t("logout")}
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
