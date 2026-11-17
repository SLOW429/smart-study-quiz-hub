"use client";

import { useParams } from "next/navigation";
import { QuizSession } from "@/components/QuizSession";

export default function QuizPage() {
  const { deckId } = useParams<{ deckId: string }>();
  return <QuizSession deckId={deckId} />;
}
