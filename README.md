# Smart Study & Quiz Hub

A local-first study app for creating decks of flashcards and multiple-choice quiz questions. Decks are saved in your browser's local storage; there is no account, backend, or external API.

## Requirements

- Node.js LTS and npm

## Run locally

From the project directory:

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To create a production build, run:

```powershell
npm run build
npm start
```

## Using the app

1. Select **Create new deck** on the dashboard.
2. Enter a deck title and optionally a description.
3. Add one or more flashcards, quiz questions, or both. Quiz questions have four options; select the radio button beside the correct answer. Explanations are optional.
4. Save the deck, then choose **Study cards** or **Take quiz** from the dashboard.

Flashcards flip to reveal their answers. Quizzes show whether each selected answer is correct, display an explanation, and calculate the final score.

## Project structure

```text
app/          Next.js App Router pages and global styles
components/   Dashboard, deck form, study mode, quiz mode, and deck state
data/         Local-storage configuration
types/        TypeScript interfaces for decks and study content
```

Decks are stored in this browser under the `smart-study-quiz-hub-decks` local-storage key. Clearing browser storage removes saved decks; they are not synchronized across browsers or devices.
