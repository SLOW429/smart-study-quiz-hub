"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DECKS_STORAGE_KEY } from "@/data/constants";
import type { Deck } from "@/types/study";

interface DeckContextValue {
  decks: Deck[];
  ready: boolean;
  addDeck: (deck: Omit<Deck, "id">) => Deck;
  getDeck: (id: string) => Deck | undefined;
}

const DeckContext = createContext<DeckContextValue | null>(null);

function isDeck(value: unknown): value is Deck {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.id !== "string" ||
    typeof candidate.title !== "string" ||
    typeof candidate.description !== "string" ||
    !Array.isArray(candidate.flashcards) ||
    !Array.isArray(candidate.questions)
  ) {
    return false;
  }

  const validFlashcards = candidate.flashcards.every(
    (card: unknown) =>
      Boolean(card) &&
      typeof card === "object" &&
      typeof (card as Record<string, unknown>).id === "string" &&
      typeof (card as Record<string, unknown>).front === "string" &&
      typeof (card as Record<string, unknown>).back === "string",
  );
  const validQuestions = candidate.questions.every((question: unknown) => {
    if (!question || typeof question !== "object") return false;
    const item = question as Record<string, unknown>;
    return (
      typeof item.id === "string" &&
      typeof item.question === "string" &&
      Array.isArray(item.options) &&
      item.options.length === 4 &&
      item.options.every((option: unknown) => typeof option === "string") &&
      typeof item.correctIndex === "number" &&
      Number.isInteger(item.correctIndex) &&
      item.correctIndex >= 0 &&
      item.correctIndex < item.options.length &&
      typeof item.explanation === "string"
    );
  });

  return validFlashcards && validQuestions;
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function DeckProvider({ children }: { children: ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(DECKS_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (!Array.isArray(parsed) || !parsed.every(isDeck)) {
          throw new Error("Saved study decks have an invalid format.");
        }
        setDecks(parsed);
      }
    } catch (error) {
      console.error("Could not load saved study decks from local storage.", error);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
    } catch (error) {
      console.error("Could not save study decks to local storage.", error);
    }
  }, [decks, ready]);

  const addDeck = useCallback((deck: Omit<Deck, "id">) => {
    const newDeck = { ...deck, id: createId() };
    setDecks((current) => [...current, newDeck]);
    return newDeck;
  }, []);

  const getDeck = useCallback((id: string) => decks.find((deck) => deck.id === id), [decks]);

  const value = useMemo(
    () => ({ decks, ready, addDeck, getDeck }),
    [decks, ready, addDeck, getDeck],
  );

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
}

export function useDecks() {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error("useDecks must be used within a DeckProvider.");
  }
  return context;
}
