import { FlashcardContainer } from "@/components/flashcard-container";
import { sampleFlashcards } from "@/lib/data";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">German Vocabulary Flashcards</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Click on a card to flip it and reveal the English translation. Each card includes example 
          sentences to help you understand the word in context. Practice your German vocabulary with these 
          interactive flashcards!
        </p>
      </header>
      
      <main>
        <FlashcardContainer cards={sampleFlashcards} />
      </main>
    </div>
  );
}
