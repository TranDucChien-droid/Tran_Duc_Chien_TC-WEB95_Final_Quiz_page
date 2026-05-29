import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { QuizListSkeleton } from "@/components/skeletons/QuizListSkeleton";
import { useQuizzes } from "@/hooks/useQuizzes";

export function QuizHomePage() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuizzes();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">{t("quizzes")}</h1>
      {isLoading ? (
        <QuizListSkeleton withTrailing />
      ) : !data?.length ? (
        <p className="text-slate-600 dark:text-slate-400">{t("noQuizzes")}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((q) => (
            <li key={q._id}>
              <Link
                to="/quiz/$quizId"
                params={{ quizId: q._id }}
                className="flex h-full min-h-[8rem] flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-600"
              >
                <div className="flex-1">
                  <div className="font-medium">{q.title}</div>
                  {q.description && (
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{q.description}</p>
                  )}
                </div>
                <span className="mt-4 text-sm font-semibold text-teal-700 dark:text-teal-400">{t("start")} →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
