"use client";

import { useState } from "react";
import Link from "next/link";
import { useDecks } from "@/components/DeckProvider";

export function StudySession({ deckId }: { deckId: string }) {
  const { getDeck, ready } = useDecks();
  const deck = getDeck(deckId);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

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

  if (deck.flashcards.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-12">
        <Link href="/" className="text-sm font-bold text-indigo-700">← Dashboard</Link>
        <h1 className="mt-8 text-3xl font-black text-slate-900">{deck.title}</h1>
        <p className="mt-3 text-slate-600">This deck doesn’t have any flashcards yet.</p>
        <Link href={`/decks/${deck.id}/quiz`} className="mt-5 inline-block font-bold text-indigo-700">
          Take the quiz instead →
        </Link>
      </main>
    );
  }

  const card = deck.flashcards[index];

  function changeCard(nextIndex: number) {
    setIndex(nextIndex);
    setFlipped(false);
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-8 sm:px-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-indigo-700">← Dashboard</Link>
        <Link href={`/decks/${deck.id}/quiz`} className="text-sm font-bold text-slate-600 hover:text-indigo-700">
          Take quiz →
        </Link>
      </div>
      <div className="mt-10 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">Flashcard study</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">{deck.title}</h1>
        <p className="mt-3 text-sm font-medium text-slate-500">
          Card {index + 1} of {deck.flashcards.length}
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${((index + 1) / deck.flashcards.length) * 100}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((current) => !current)}
        aria-label={flipped ? "Show flashcard prompt" : "Flip to show flashcard answer"}
        className="mt-8 flex min-h-80 w-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:border-indigo-200 hover:shadow-md"
      >
        <span className="mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
          {flipped ? "Answer" : "Prompt"}
        </span>
        <span className="max-w-2xl text-2xl font-bold leading-relaxed text-slate-900 sm:text-3xl">
          {flipped ? card.back : card.front}
        </span>
        <span className="mt-8 text-sm text-slate-400">Click to flip</span>
      </button>

      <div className="mt-6 flex justify-between gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => changeCard(index - 1)}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        {index < deck.flashcards.length - 1 ? (
          <button
            type="button"
            onClick={() => changeCard(index + 1)}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700"
          >
            Next card
          </button>
        ) : (
          <button
            type="button"
            onClick={() => changeCard(0)}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700"
          >
            Start over
          </button>
        )}
      </div>
    </main>
  );
}
