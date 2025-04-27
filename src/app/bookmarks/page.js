"use client";

import { useState, useEffect } from "react";
import { FlashcardContainer } from "@/components/flashcard-container";
import { allFlashcards } from "@/lib/categories";

export default function BookmarksPage() {
  const [bookmarkedCards, setBookmarkedCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get bookmarked cards from localStorage
    const loadBookmarks = () => {
      try {
        const bookmarks = JSON.parse(localStorage.getItem("bookmarkedCards")) || {};
        const bookmarkedIds = Object.keys(bookmarks).filter(id => bookmarks[id]);
        
        // Filter cards that are bookmarked
        const cards = allFlashcards.filter(card => 
          bookmarkedIds.includes(card.question)
        );
        
        setBookmarkedCards(cards);
      } catch (error) {
        console.error("Failed to load bookmarks:", error);
        setBookmarkedCards([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadBookmarks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-teal-400">
          Bookmarked Cards
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Your collection of bookmarked flashcards for focused study. 
          These are cards you've marked to revisit.
        </p>
      </header>
      
      <main>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-teal-400">Loading bookmarks...</div>
          </div>
        ) : bookmarkedCards.length > 0 ? (
          <FlashcardContainer cards={bookmarkedCards} />
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400 mb-4">You haven't bookmarked any cards yet.</p>
            <p className="text-zinc-500">Bookmark cards by clicking the bookmark icon in the corner of any card.</p>
          </div>
        )}
      </main>
    </div>
  );
} 