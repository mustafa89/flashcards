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
  // State for bookmarked cards
  const [bookmarkedCards, setBookmarkedCards] = useState({});
  // Additional filter for bookmarked cards
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  
  // Extract all categories on component mount
  useEffect(() => {
    const uniqueCategories = ["All"];
    cards.forEach(card => {
      if (card.category && !uniqueCategories.includes(card.category)) {
        uniqueCategories.push(card.category);
      }
    });
    setCategories(uniqueCategories);
    
    // Load bookmarked cards from localStorage
    try {
      const savedBookmarks = JSON.parse(localStorage.getItem("flashcardBookmarks") || "{}");
      setBookmarkedCards(savedBookmarks);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  }, [cards]);
  
  // Filter cards when selectedCategory or bookmarked filter changes
  useEffect(() => {
    let filtered = cards;
    
    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(card => card.category === selectedCategory);
    }
    
    // Apply bookmarked filter if enabled
    if (showBookmarkedOnly) {
      filtered = filtered.filter(card => bookmarkedCards[card.question]);
    }
    
    setFilteredCards(filtered);
  }, [selectedCategory, cards, bookmarkedCards, showBookmarkedOnly]);
  
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
  
  const handleBookmarkToggle = (question, isBookmarked) => {
    const updatedBookmarks = { ...bookmarkedCards, [question]: isBookmarked };
    
    // If a card is unmarked, remove it from the object to keep it clean
    if (!isBookmarked) {
      delete updatedBookmarks[question];
    }
    
    setBookmarkedCards(updatedBookmarks);
    
    // Save to localStorage
    try {
      localStorage.setItem("flashcardBookmarks", JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error("Error saving bookmarks:", error);
    }
  };
  
  const toggleBookmarkedFilter = () => {
    setShowBookmarkedOnly(prev => !prev);
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
          <button 
            onClick={toggleBookmarkedFilter}
            className={`px-6 py-2 rounded-md transition-colors duration-300 border flex items-center gap-2 ${
              showBookmarkedOnly 
                ? "bg-emerald-700 text-white border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                : "bg-zinc-800 text-white border-zinc-600 hover:border-emerald-500/30"
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill={showBookmarkedOnly ? "#10B981" : "none"}
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            {showBookmarkedOnly ? "All Cards" : "Bookmarked Only"}
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredCards.length > 0 ? (
          filteredCards.map((card, index) => (
            <Flashcard
              key={index}
              question={card.question}
              answer={card.answer}
              category={card.category}
              sampleGerman={card.sampleGerman}
              sampleEnglish={card.sampleEnglish}
              forceFlip={revealAll}
              onBookmark={handleBookmarkToggle}
              isBookmarked={Boolean(bookmarkedCards[card.question])}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-zinc-400 mb-3">No cards match your current filters.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setShowBookmarkedOnly(false);
              }}
              className="px-4 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-600 transition-colors duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 