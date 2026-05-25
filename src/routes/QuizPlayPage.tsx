import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/Button";
import { QuizDetailSkeleton } from "@/components/skeletons/QuizDetailSkeleton";
import { useQuizDetail } from "@/hooks/useQuizDetail";
import { useSubmitAttempt } from "@/hooks/useSubmitAttempt";

export function QuizPlayPage() {
  const router = useRouter();
  const match = router.state.matches[router.state.matches.length - 1];
  const params = match?.params as { quizId?: string } | undefined;
  const quizId = params?.quizId;
  const { t } = useTranslation();
  const [selections, setSelections] = useState<Record<string, number[]>>({});
  const [result, setResult] = useState<{ score: number; correct: number; total: number } | null>(null);

  const { data, isLoading, error } = useQuizDetail(quizId);
  const submitAttemptMutation = useSubmitAttempt();

  const questions = data?.questions ?? [];
  const isSubmitting = submitAttemptMutation.isPending;

  function toggleOption(qid: string, idx: number, type: "single" | "multiple") {
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
    if (!quizId) return;
    setResult(null);
    try {
      const res = await submitAttemptMutation.mutateAsync({
        quizId,
        answers: answersPayload,
      });
      setResult({ score: res.score, correct: res.correct, total: res.total });
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
        {questions.map((q, qi) => (
          <li key={q._id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="font-medium">
              {qi + 1}. {q.question}
            </p>
            <p className="mt-1 text-xs uppercase text-slate-500">{q.type}</p>
            <ul className="mt-3 space-y-2">
              {q.options.map((opt, i) => {
                const selected = (selections[q._id] ?? []).includes(i);
                const inputType = q.type === "single" ? "radio" : "checkbox";
                return (
                  <li key={i}>
                    <label className="flex cursor-pointer items-start gap-2 rounded-md border border-transparent px-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <input
                        type={inputType}
                        name={q.type === "single" ? q._id : `${q._id}-${i}`}
                        checked={selected}
                        disabled={isSubmitting}
                        onChange={() => toggleOption(q._id, i, q.type)}
                        className="mt-1"
                      />
                      <span>{opt}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      <Button
        fullWidth
        className="py-3 font-semibold"
        loading={isSubmitting}
        disabled={!questions.length}
        onClick={() => void submit()}
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </div>
  );
}
