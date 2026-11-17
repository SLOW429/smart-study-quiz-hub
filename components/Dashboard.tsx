"use client";

import Link from "next/link";
import { useDecks } from "@/components/DeckProvider";

export function Dashboard() {
  const { decks, ready } = useDecks();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-10 sm:px-8">
      <header className="mb-12 flex flex-wrap items-center justify-between gap-5">
        <Link href="/" className="text-xl font-black tracking-tight text-slate-900">
          Study<span className="text-indigo-600">Hub</span>
        </Link>
        <Link
          href="/decks/new"
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
        >
          + Create new deck
        </Link>
      </header>

      <section className="mb-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
          Your learning space
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Study smarter.
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
          Build a deck, practice with flashcards, and check what you know with a quiz.
          Your decks stay on this device.
        </p>
      </section>

      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-2xl font-extrabold text-slate-900">Your decks</h2>
        {ready && decks.length > 0 && (
          <span className="text-sm text-slate-500">{decks.length} saved</span>
        )}
      </div>

      {!ready ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">
          Loading your decks…
        </div>
      ) : decks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
            ✦
          </div>
          <h3 className="text-xl font-bold text-slate-900">Your first deck starts here</h3>
          <p className="mx-auto mt-2 max-w-md text-slate-600">
            Add your own flashcards and multiple-choice questions, then practice at your pace.
          </p>
          <Link
            href="/decks/new"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700"
          >
            Create your first deck
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {decks.map((deck) => (
            <li
              key={deck.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-extrabold text-slate-900">{deck.title}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                {deck.description || "A personal study deck."}
              </p>
              <p className="mt-4 text-sm font-medium text-slate-500">
                {deck.flashcards.length} flashcards <span className="px-1">·</span>{" "}
                {deck.questions.length} quiz questions
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/decks/${deck.id}/study`}
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Study cards
                </Link>
                <Link
                  href={`/decks/${deck.id}/quiz`}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Take quiz
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
