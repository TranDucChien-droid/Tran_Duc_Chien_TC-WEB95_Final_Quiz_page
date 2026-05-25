import { useTranslation } from "react-i18next";
import { QuizListSkeleton } from "@/components/skeletons/QuizListSkeleton";
import { useMyAttempts } from "@/hooks/useMyAttempts";

export function AttemptsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useMyAttempts();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">{t("myAttempts")}</h1>
      {isLoading ? (
        <QuizListSkeleton withTrailing />
      ) : (
        <ul className="space-y-3">
          {data?.map((a) => {
            const title = typeof a.quizId === "object" && a.quizId && "title" in a.quizId ? a.quizId.title : "Quiz";
            return (
              <li
                key={a._id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="font-medium">{title}</div>
                  <div className="text-xs text-slate-500">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-lg font-semibold text-teal-700 dark:text-teal-400">{a.score}%</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
