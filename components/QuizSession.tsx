"use client";

import { useState } from "react";
import Link from "next/link";
import { useDecks } from "@/components/DeckProvider";

export function QuizSession({ deckId }: { deckId: string }) {
  const { getDeck, ready } = useDecks();
  const deck = getDeck(deckId);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [complete, setComplete] = useState(false);

  if (!ready) {
    return <main className="mx-auto max-w-3xl px-5 py-12 text-slate-500">Loading your deck…</main>;
  }

  if (!deck) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-slate-700">This deck could not be found on this device.</p>
        <Link href="/" className="mt-4 inline-block font-bold text-indigo-700">← Dashboard</Link>
      </main>
    );
  }

  if (deck.questions.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-12">
        <Link href="/" className="text-sm font-bold text-indigo-700">← Dashboard</Link>
        <h1 className="mt-8 text-3xl font-black text-slate-900">{deck.title}</h1>
        <p className="mt-3 text-slate-600">This deck doesn’t have any quiz questions yet.</p>
        <Link href={`/decks/${deck.id}/study`} className="mt-5 inline-block font-bold text-indigo-700">
          Study the flashcards instead →
        </Link>
      </main>
    );
  }

  const correctCount = deck.questions.reduce(
    (total, question, questionIndex) =>
      total + (answers[questionIndex] === question.correctIndex ? 1 : 0),
    0,
  );

  function restartQuiz() {
    setAnswers({});
    setIndex(0);
    setComplete(false);
  }

  if (complete) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-5 py-10 sm:px-8">
        <Link href="/" className="text-sm font-bold text-indigo-700">← Dashboard</Link>
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">Quiz complete</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">{deck.title}</h1>
          <p className="mt-8 text-5xl font-black text-indigo-600">
            {correctCount} / {deck.questions.length}
          </p>
          <p className="mt-3 text-slate-600">correct answers</p>
          <button
            type="button"
            onClick={restartQuiz}
            className="mt-8 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  const question = deck.questions[index];
  const selectedAnswer = answers[index];
  const answered = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === question.correctIndex;

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-8 sm:px-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-indigo-700">← Dashboard</Link>
        <Link href={`/decks/${deck.id}/study`} className="text-sm font-bold text-slate-600 hover:text-indigo-700">
          Study cards →
        </Link>
      </div>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">Quiz mode</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">{deck.title}</h1>
          </div>
          <p className="shrink-0 text-sm font-bold text-slate-500">
            {index + 1} / {deck.questions.length}
          </p>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${((index + 1) / deck.questions.length) * 100}%` }}
          />
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xl font-bold leading-relaxed text-slate-900">{question.question}</p>
          <div className="mt-6 space-y-3">
            {question.options.map((option, optionIndex) => {
              const isSelected = selectedAnswer === optionIndex;
              const isAnswer = question.correctIndex === optionIndex;
              let optionStyle = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50";
              if (answered && isAnswer) optionStyle = "border-emerald-300 bg-emerald-50 text-emerald-900";
              else if (answered && isSelected) optionStyle = "border-red-300 bg-red-50 text-red-900";

              return (
                <button
                  type="button"
                  key={optionIndex}
                  disabled={answered}
                  onClick={() =>
                    setAnswers((current) => ({ ...current, [index]: optionIndex }))
                  }
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left font-medium transition disabled:cursor-default ${optionStyle}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-600 shadow-sm">
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div
              role="status"
              className={`mt-5 rounded-xl p-4 ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}
            >
              <p className="font-extrabold">{isCorrect ? "Correct!" : "Not quite."}</p>
              <p className="mt-1 text-sm leading-6">
                {question.explanation || `The correct answer is: ${question.options[question.correctIndex]}`}
              </p>
              <p className="mt-2 text-sm font-bold">
                Score so far: {correctCount} / {Object.keys(answers).length}
              </p>
            </div>
          )}

          {answered && (
            <button
              type="button"
              onClick={() => {
                if (index === deck.questions.length - 1) {
                  setComplete(true);
                } else {
                  setIndex((current) => current + 1);
                }
              }}
              className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700"
            >
              {index === deck.questions.length - 1 ? "See final score" : "Next question"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
