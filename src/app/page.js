import { FlashcardContainer } from "@/components/flashcard-container";
import { allFlashcards } from "@/lib/categories";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-teal-400">Study All Cards</h1>
        <p className="text-zinc-400 max-w-2xl">
          Browse and study all German vocabulary cards. Hover over a card to reveal its translation and example sentences.
          Bookmark cards you find challenging to revisit later.
        </p>
      </header>
      
      <main>
        <FlashcardContainer cards={allFlashcards} />
      </main>
    </div>
  );
}
