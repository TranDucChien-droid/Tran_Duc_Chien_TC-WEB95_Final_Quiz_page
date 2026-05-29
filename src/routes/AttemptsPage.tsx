import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AttemptAnswerReview, isAttemptReviewable } from "@/components/AttemptAnswerReview";
import { Button } from "@/components/Button";
import { Drawer } from "@/components/Drawer";
import { QuizListSkeleton } from "@/components/skeletons/QuizListSkeleton";
import { useMyAttempts } from "@/hooks/useMyAttempts";
import { CARD_GRID_CLASS } from "@/constants/grid";
import type { AttemptRow } from "@/types/quiz.types";

function quizTitle(quizId: AttemptRow["quizId"]) {
  return typeof quizId === "object" && quizId && "title" in quizId ? quizId.title : "Quiz";
}

type AttemptCardProps = {
  attempt: AttemptRow;
  onView: () => void;
};

function AttemptCard({ attempt, onView }: AttemptCardProps) {
  const { t } = useTranslation();
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
      <Button className="mt-4 w-full" variant="outline" onClick={onView}>
        {t("viewAttemptDetails")} ({answers.length})
      </Button>
    </li>
  );
}

export function AttemptsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useMyAttempts();
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptRow | null>(null);

  const reviewableAttempts = useMemo(
    () => (data ?? []).filter(isAttemptReviewable),
    [data]
  );

  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-semibold">{t("myAttempts")}</h1>
      {isLoading ? (
        <QuizListSkeleton withTrailing />
      ) : !reviewableAttempts.length ? (
        <p className="text-slate-600 dark:text-slate-400">
          {data?.length ? t("noReviewableAttempts") : t("noAttempts")}
        </p>
      ) : (
        <ul className={CARD_GRID_CLASS}>
          {reviewableAttempts.map((a) => (
            <AttemptCard key={a._id} attempt={a} onView={() => setSelectedAttempt(a)} />
          ))}
        </ul>
      )}

      <Drawer
        open={selectedAttempt != null}
        onClose={() => setSelectedAttempt(null)}
        title={selectedAttempt ? quizTitle(selectedAttempt.quizId) : ""}
      >
        {selectedAttempt && (
          <div className="space-y-4">
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950/40">
              <p className="text-lg font-semibold">
                {t("score")}: {selectedAttempt.score}%
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {new Date(selectedAttempt.createdAt).toLocaleString()}
              </p>
            </div>
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                {t("answerReview")}
              </h3>
              <AttemptAnswerReview answers={selectedAttempt.answers ?? []} />
            </section>
          </div>
        )}
      </Drawer>
    </div>
  );
}
