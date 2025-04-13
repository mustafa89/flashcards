"use client";

import { useState } from "react";
import { Flashcard } from "@/components/flashcard";

export function FlashcardContainer({ cards }) {
  // Use null for initial state (undefined), true for reveal, false for reset
  const [revealAll, setRevealAll] = useState(null);
  
  const handleRevealAll = () => {
    setRevealAll(true);
  };
  
  const handleResetAll = () => {
    // First set to false to force reset all cards
    setRevealAll(false);
    
    // Then set back to null after a short delay to allow hover flipping again
    setTimeout(() => {
      setRevealAll(null);
    }, 100);
  };
  
  return (
    <div>
      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={handleRevealAll}
          className="px-6 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-600 transition-colors duration-300 border border-teal-500 shadow-[0_0_10px_rgba(100,255,218,0.3)] hover:shadow-[0_0_15px_rgba(100,255,218,0.5)]"
        >
          Reveal All Cards
        </button>
        <button 
          onClick={handleResetAll}
          className="px-6 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors duration-300 border border-zinc-600 hover:border-teal-500/30"
        >
          Reset All Cards
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {cards.map((card, index) => (
          <Flashcard
            key={index}
            question={card.question}
            answer={card.answer}
            category={card.category}
            sampleGerman={card.sampleGerman}
            sampleEnglish={card.sampleEnglish}
            forceFlip={revealAll}
          />
        ))}
      </div>
    </div>
  );
} 