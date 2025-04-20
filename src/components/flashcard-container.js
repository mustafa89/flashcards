"use client";

import { useState, useEffect } from "react";
import { Flashcard } from "@/components/flashcard";

export function FlashcardContainer({ cards }) {
  // Use null for initial state (undefined), true for reveal, false for reset
  const [revealAll, setRevealAll] = useState(null);
  // State for category filtering
  const [selectedCategory, setSelectedCategory] = useState("All");
  // State to store all available categories
  const [categories, setCategories] = useState(["All"]);
  // State for filtered cards
  const [filteredCards, setFilteredCards] = useState(cards);
  
  // Extract all categories on component mount
  useEffect(() => {
    const uniqueCategories = ["All"];
    cards.forEach(card => {
      if (card.category && !uniqueCategories.includes(card.category)) {
        uniqueCategories.push(card.category);
      }
    });
    setCategories(uniqueCategories);
  }, [cards]);
  
  // Filter cards when selectedCategory changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredCards(cards);
    } else {
      setFilteredCards(cards.filter(card => card.category === selectedCategory));
    }
  }, [selectedCategory, cards]);
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  
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
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="flex justify-center gap-4">
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
        
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-zinc-400 mr-2 self-center">Filter by category:</span>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-teal-700 text-white border border-teal-500 shadow-[0_0_10px_rgba(100,255,218,0.3)]"
                  : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
              }`}
            >
              {category}
              {selectedCategory === category && category !== "All" && (
                <span className="ml-2 text-xs">{filteredCards.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-8xl mx-auto">
        {filteredCards.map((card, index) => (
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