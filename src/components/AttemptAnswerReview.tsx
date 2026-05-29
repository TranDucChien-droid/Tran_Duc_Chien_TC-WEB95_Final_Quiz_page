import { useTranslation } from "react-i18next";
import type { AttemptAnswerDetail } from "@/types/quiz.types";

function formatLabels(labels: string[] | undefined, fallback: string) {
  if (labels?.length) return labels.join(", ");
  return fallback;
}

type AttemptAnswerReviewProps = {
  answers: AttemptAnswerDetail[];
  className?: string;
};

export function AttemptAnswerReview({ answers, className = "" }: AttemptAnswerReviewProps) {
  const { t } = useTranslation();

  if (!answers.length) {
    return <p className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}>{t("noAnswerDetails")}</p>;
  }

  return (
    <ol className={`space-y-3 ${className}`}>
      {answers.map((answer, index) => (
        <li
          key={String(answer.questionId)}
          className={`rounded-lg border p-3 text-sm ${
            answer.isCorrect
              ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/40"
              : "border-rose-200 bg-rose-50/80 dark:border-rose-900 dark:bg-rose-950/40"
          }`}
        >
          <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
            <span className="font-medium text-slate-800 dark:text-slate-100">
              {index + 1}. {answer.question ?? t("unknownQuestion")}
            </span>
            <span
              className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${
                answer.isCorrect
                  ? "bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100"
                  : "bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100"
              }`}
            >
              {answer.isCorrect ? t("answerCorrect") : t("answerIncorrect")}
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            <span className="font-medium">{t("yourAnswer")}: </span>
            {formatLabels(answer.selectedLabels, t("noAnswer"))}
          </p>
          {!answer.isCorrect && (
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              <span className="font-medium">{t("correctAnswer")}: </span>
              {formatLabels(answer.correctLabels, "—")}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

export function answerByQuestionId(answers: AttemptAnswerDetail[] | undefined, questionId: string) {
  return answers?.find((a) => String(a.questionId) === String(questionId));
}

export function isAttemptReviewable(attempt: { reviewable?: boolean }): boolean {
  return attempt.reviewable === true;
}
