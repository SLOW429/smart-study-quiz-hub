"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDecks } from "@/components/DeckProvider";
import type { Flashcard, QuizQuestion } from "@/types/study";

interface DraftFlashcard {
  front: string;
  back: string;
}

interface DraftQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const blankQuestion = (): DraftQuestion => ({
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  explanation: "",
});

export function CreateDeckForm() {
  const router = useRouter();
  const { addDeck } = useDecks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [flashcards, setFlashcards] = useState<DraftFlashcard[]>([{ front: "", back: "" }]);
  const [questions, setQuestions] = useState<DraftQuestion[]>([blankQuestion()]);
  const [error, setError] = useState("");

  function updateFlashcard(index: number, field: keyof DraftFlashcard, value: string) {
    setFlashcards((current) =>
      current.map((card, cardIndex) =>
        cardIndex === index ? { ...card, [field]: value } : card,
      ),
    );
  }

  function updateQuestion(index: number, update: Partial<DraftQuestion>) {
    setQuestions((current) =>
      current.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...update } : question,
      ),
    );
  }

  function updateOption(questionIndex: number, optionIndex: number, value: string) {
    setQuestions((current) =>
      current.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: question.options.map((option, currentOption) =>
                currentOption === optionIndex ? value : option,
              ),
            }
          : question,
      ),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Enter a title for this deck.");
      return;
    }

    const partialCard = flashcards.some((card) => Boolean(card.front.trim()) !== Boolean(card.back.trim()));
    if (partialCard) {
      setError("Complete both the front and back of each flashcard, or leave both blank.");
      return;
    }

    const completedCards: Flashcard[] = flashcards
      .filter((card) => card.front.trim() && card.back.trim())
      .map((card) => ({
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        front: card.front.trim(),
        back: card.back.trim(),
      }));

    const startedQuestions = questions.filter(
      (question) =>
        question.question.trim() ||
        question.explanation.trim() ||
        question.options.some((option) => option.trim()),
    );
    if (
      startedQuestions.some(
        (question) =>
          !question.question.trim() || question.options.some((option) => !option.trim()),
      )
    ) {
      setError("Complete the question and all four answer options, or leave the question blank.");
      return;
    }

    const completedQuestions: QuizQuestion[] = startedQuestions.map((question) => ({
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      question: question.question.trim(),
      options: question.options.map((option) => option.trim()),
      correctIndex: question.correctIndex,
      explanation: question.explanation.trim(),
    }));

    if (completedCards.length === 0 && completedQuestions.length === 0) {
      setError("Add at least one complete flashcard or quiz question.");
      return;
    }

    addDeck({
      title: title.trim(),
      description: description.trim(),
      flashcards: completedCards,
      questions: completedQuestions,
    });
    router.push("/");
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-8 sm:px-8">
      <Link href="/" className="text-sm font-bold text-indigo-700 hover:text-indigo-900">
        ← Back to dashboard
      </Link>
      <div className="mb-8 mt-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
          Build your study set
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Create a new deck
        </h1>
        <p className="mt-3 text-slate-600">Add flashcards, quiz questions, or both.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-extrabold text-slate-900">Deck details</h2>
          <label className="mt-5 block text-sm font-bold text-slate-700" htmlFor="deck-title">
            Title
          </label>
          <input
            id="deck-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={100}
            placeholder="e.g. Biology: Cell Structure"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
          <label className="mt-5 block text-sm font-bold text-slate-700" htmlFor="deck-description">
            Description <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="deck-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={2}
            maxLength={300}
            placeholder="What are you studying?"
            className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Flashcards</h2>
              <p className="mt-1 text-sm text-slate-500">A prompt on the front, an answer on the back.</p>
            </div>
            <button
              type="button"
              onClick={() => setFlashcards((current) => [...current, { front: "", back: "" }])}
              className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-50"
            >
              + Add card
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {flashcards.map((card, index) => (
              <div key={index} className="rounded-xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700">Card {index + 1}</h3>
                  {flashcards.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setFlashcards((current) => current.filter((_, cardIndex) => cardIndex !== index))
                      }
                      className="text-sm font-semibold text-slate-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <textarea
                    value={card.front}
                    onChange={(event) => updateFlashcard(index, "front", event.target.value)}
                    rows={2}
                    placeholder="Front / prompt"
                    aria-label={`Card ${index + 1} front`}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500"
                  />
                  <textarea
                    value={card.back}
                    onChange={(event) => updateFlashcard(index, "back", event.target.value)}
                    rows={2}
                    placeholder="Back / answer"
                    aria-label={`Card ${index + 1} back`}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Quiz questions</h2>
              <p className="mt-1 text-sm text-slate-500">Provide four options and mark the correct one.</p>
            </div>
            <button
              type="button"
              onClick={() => setQuestions((current) => [...current, blankQuestion()])}
              className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-50"
            >
              + Add question
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="rounded-xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700">Question {index + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setQuestions((current) =>
                          current.filter((_, questionIndex) => questionIndex !== index),
                        )
                      }
                      className="text-sm font-semibold text-slate-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <textarea
                  value={question.question}
                  onChange={(event) => updateQuestion(index, { question: event.target.value })}
                  rows={2}
                  placeholder="Write the question"
                  aria-label={`Question ${index + 1}`}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500"
                />
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={question.correctIndex === optionIndex}
                        onChange={() => updateQuestion(index, { correctIndex: optionIndex })}
                        aria-label={`Mark option ${optionIndex + 1} as correct for question ${index + 1}`}
                        className="h-4 w-4 accent-indigo-600"
                      />
                      <input
                        value={option}
                        onChange={(event) => updateOption(index, optionIndex, event.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        aria-label={`Question ${index + 1}, option ${optionIndex + 1}`}
                        className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500"
                      />
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">Select the circle beside the correct answer.</p>
                <input
                  value={question.explanation}
                  onChange={(event) => updateQuestion(index, { explanation: event.target.value })}
                  placeholder="Explanation shown after answering (optional)"
                  aria-label={`Question ${index + 1} explanation`}
                  className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>
        </section>

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-3 pb-10">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Save deck
          </button>
          <Link
            href="/"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
