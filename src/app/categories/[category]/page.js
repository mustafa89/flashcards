"use client";

import { use } from "react";
import { FlashcardContainer } from "@/components/flashcard-container";
import { allFlashcards } from "@/lib/categories";
import { notFound } from "next/navigation";

// Convert snake-case or regular text to Title Case
function toTitleCase(str) {
  return str
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Map URL slugs to actual category names in our data
const categoryMap = {
  'verbs': 'Verbs',
  'nouns': 'Nouns',
  'adjectives': 'Adjectives',
  'adverbs': 'Adverbs',
  'prepositions': 'Prepositions',
  'expressions': 'Expressions'
};

export default function CategoryPage({ params }) {
  // Unwrap the params Promise with use()
  const unwrappedParams = use(params);
  const categorySlug = unwrappedParams.category;
  const categoryName = categoryMap[categorySlug];
  
  if (!categoryName) {
    notFound();
  }
  
  const filteredCards = allFlashcards.filter(
    card => card.category === categoryName
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-teal-400">
          {categoryName}
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Study {categoryName.toLowerCase()} flashcards to expand your German vocabulary.
          Hover over a card to reveal its translation and example sentences.
        </p>
      </header>
      
      <main>
        {filteredCards.length > 0 ? (
          <FlashcardContainer cards={filteredCards} />
        ) : (
          <div className="text-center py-12 text-zinc-400">
            No flashcards found for this category.
          </div>
        )}
      </main>
    </div>
  );
} 