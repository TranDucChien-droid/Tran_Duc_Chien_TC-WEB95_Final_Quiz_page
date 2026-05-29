import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AttemptAnswerReview, isAttemptReviewable } from "@/components/AttemptAnswerReview";
import { QuizListSkeleton } from "@/components/skeletons/QuizListSkeleton";
import { useMyAttempts } from "@/hooks/useMyAttempts";
import type { AttemptRow } from "@/types/quiz.types";

function quizTitle(quizId: AttemptRow["quizId"]) {
  return typeof quizId === "object" && quizId && "title" in quizId ? quizId.title : "Quiz";
}

function AttemptCard({ attempt }: { attempt: AttemptRow }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const answers = attempt.answers ?? [];

  return (
    <li className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="font-medium">{quizTitle(attempt.quizId)}</div>
          <div className="text-xs text-slate-500">{new Date(attempt.createdAt).toLocaleString()}</div>
        </div>
        <div className="text-lg font-semibold text-teal-700 dark:text-teal-400">{attempt.score}%</div>
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 text-sm font-medium text-teal-700 hover:underline dark:text-teal-400"
      >
        {open ? t("hideAnswers") : t("showAnswers")} ({answers.length})
      </button>
      {open && (
        <AttemptAnswerReview answers={answers} className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800" />
      )}
    </li>
  );
}

export function AttemptsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useMyAttempts();

  const reviewableAttempts = useMemo(
    () => (data ?? []).filter(isAttemptReviewable),
    [data]
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">{t("myAttempts")}</h1>
      {isLoading ? (
        <QuizListSkeleton withTrailing />
      ) : !reviewableAttempts.length ? (
        <p className="text-slate-600 dark:text-slate-400">
          {data?.length ? t("noReviewableAttempts") : t("noAttempts")}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {reviewableAttempts.map((a) => (
            <AttemptCard key={a._id} attempt={a} />
          ))}
        </ul>
      )}
    </div>
  );
}
