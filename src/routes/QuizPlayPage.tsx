import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import clsx from "clsx";
import { AttemptAnswerReview, answerByQuestionId } from "@/components/AttemptAnswerReview";
import { Button } from "@/components/Button";
import { QuizDetailSkeleton } from "@/components/skeletons/QuizDetailSkeleton";
import { useQuizDetail } from "@/hooks/useQuizDetail";
import { useSubmitAttempt } from "@/hooks/useSubmitAttempt";
import type { SubmitAttemptResult } from "@/types/quiz.types";

export function QuizPlayPage() {
  const router = useRouter();
  const match = router.state.matches[router.state.matches.length - 1];
  const params = match?.params as { quizId?: string } | undefined;
  const quizId = params?.quizId;
  const { t } = useTranslation();
  const [selections, setSelections] = useState<Record<string, number[]>>({});
  const [result, setResult] = useState<SubmitAttemptResult | null>(null);

  const { data, isLoading, error } = useQuizDetail(quizId);
  const submitAttemptMutation = useSubmitAttempt();

  const questions = data?.questions ?? [];
  const isSubmitting = submitAttemptMutation.isPending;
  const submitted = result != null;

  function toggleOption(qid: string, idx: number, type: "single" | "multiple") {
    if (submitted) return;
    setSelections((prev) => {
      const cur = prev[qid] ?? [];
      if (type === "single") {
        return { ...prev, [qid]: [idx] };
      }
      const has = cur.includes(idx);
      const next = has ? cur.filter((i) => i !== idx) : [...cur, idx].sort((a, b) => a - b);
      return { ...prev, [qid]: next };
    });
  }

  const answersPayload = useMemo(
    () =>
      questions.map((q) => ({
        questionId: q._id,
        selectedIndexes: selections[q._id] ?? [],
      })),
    [questions, selections]
  );

  async function submit() {
    if (!quizId || submitted) return;
    setResult(null);
    try {
      const res = await submitAttemptMutation.mutateAsync({
        quizId,
        answers: answersPayload,
      });
      setResult(res);
    } catch {
      setResult(null);
    }
  }

  if (!quizId) return <p className="text-red-600">Invalid quiz</p>;
  if (isLoading) return <QuizDetailSkeleton variant="play" />;
  if (error || !data) return <p className="text-red-600">Failed to load quiz</p>;

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm text-teal-700 hover:underline dark:text-teal-400">
        ← {t("back")}
      </Link>
      <div>
        <h1 className="text-2xl font-semibold">{data.title}</h1>
        {data.description && <p className="mt-2 text-slate-600 dark:text-slate-400">{data.description}</p>}
      </div>

      {result && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950/40">
          <p className="text-lg font-semibold">
            {t("score")}: {result.score}%
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {t("correct")}: {result.correct} / {t("total")}: {result.total}
          </p>
        </div>
      )}

      <ol className="space-y-6">
        {questions.map((q, qi) => {
          const review = answerByQuestionId(result?.answers, q._id);
          const isCorrect = review?.isCorrect;
          return (
            <li
              key={q._id}
              className={clsx(
                "rounded-xl border bg-white p-4 dark:bg-slate-900",
                submitted &&
                  (isCorrect
                    ? "border-emerald-300 dark:border-emerald-800"
                    : "border-rose-300 dark:border-rose-800"),
                !submitted && "border-slate-200 dark:border-slate-800"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium">
                  {qi + 1}. {q.question}
                </p>
                {submitted && review && (
                  <span
                    className={clsx(
                      "shrink-0 rounded px-2 py-0.5 text-xs font-semibold",
                      isCorrect
                        ? "bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100"
                        : "bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100"
                    )}
                  >
                    {isCorrect ? t("answerCorrect") : t("answerIncorrect")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs uppercase text-slate-500">{q.type}</p>
              <ul className="mt-3 space-y-2">
                {q.options.map((opt, i) => {
                  const selected = (selections[q._id] ?? []).includes(i);
                  const inputType = q.type === "single" ? "radio" : "checkbox";
                  return (
                    <li key={i}>
                      <label
                        className={clsx(
                          "flex items-start gap-2 rounded-md border border-transparent px-2 py-1",
                          !submitted && "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800",
                          submitted && selected && isCorrect && "bg-emerald-50/80 dark:bg-emerald-950/30",
                          submitted && selected && !isCorrect && "bg-rose-50/80 dark:bg-rose-950/30"
                        )}
                      >
                        <input
                          type={inputType}
                          name={q.type === "single" ? q._id : `${q._id}-${i}`}
                          checked={selected}
                          disabled={submitted || isSubmitting}
                          onChange={() => toggleOption(q._id, i, q.type)}
                          className="mt-1"
                        />
                        <span>{opt}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              {submitted && review && !isCorrect && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium">{t("correctAnswer")}: </span>
                  {(review.correctLabels ?? []).join(", ") || "—"}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {!submitted ? (
        <Button
          fullWidth
          className="py-3 font-semibold"
          loading={isSubmitting}
          disabled={!questions.length}
          onClick={() => void submit()}
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      ) : (
        <div className="space-y-4">
          {result.answers && result.answers.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">{t("answerReview")}</h2>
              <AttemptAnswerReview answers={result.answers} />
            </section>
          )}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => router.navigate({ to: "/attempts" })}>
              {t("myAttempts")}
            </Button>
            <Button variant="outline" onClick={() => router.navigate({ to: "/" })}>
              {t("quizzes")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
