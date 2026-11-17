import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DeckProvider } from "@/components/DeckProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Study Hub",
  description: "Create study decks, flashcards, and quizzes.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <DeckProvider>{children}</DeckProvider>
      </body>
    </html>
  );
}
