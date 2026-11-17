export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  flashcards: Flashcard[];
  questions: QuizQuestion[];
}
