"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { Flashcard } from "@/components/flashcard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MenuIcon, BookmarkIcon } from "@/components/icons";

// Memoize the sidebar list item component for better performance
const SidebarItem = memo(({ card, index, isBookmarked, onClick, onToggleBookmark }) => (
  <li className="relative">
    <Tooltip>
      <TooltipTrigger asChild>
        <button 
          onClick={onClick}
          className={`w-full px-3 py-2 rounded-lg transition-all duration-200 flex items-center text-sm ${
            isBookmarked
            ? "bg-teal-900/20 border border-teal-900/30 hover:bg-teal-900/30" 
            : "hover:bg-zinc-800/60"
          }`}
        >
          <span className="w-6 inline-block text-right mr-2 text-zinc-500 font-mono text-xs">
            {index + 1}.
          </span>
          <span className={`${isBookmarked ? "text-teal-200" : "text-zinc-300"} truncate text-left`}>
            {card.question}
          </span>
          {isBookmarked && (
            <span className="ml-1 flex-shrink-0">
              <BookmarkIcon width={14} height={14} filled={true} />
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="right" 
        align="start" 
        sideOffset={8}
        className="bg-zinc-800 text-white p-4 rounded-lg shadow-xl border border-zinc-700 max-w-sm w-[320px]"
      >
        <div className="mb-3 flex justify-between items-center">
          <span className="font-medium text-teal-300 text-base">{card.question}</span>
          {card.category && (
            <span className="text-xs bg-zinc-700 text-teal-200 px-2 py-0.5 rounded-full">
              {card.category}
            </span>
          )}
        </div>
        <div className="text-white text-base font-medium mb-2">
          {card.answer}
        </div>
        {card.sampleGerman && (
          <div className="mt-3 pt-3 border-t border-zinc-700 text-sm">
            <div className="text-zinc-300">{card.sampleGerman}</div>
            <div className="text-zinc-400 italic mt-1">{card.sampleEnglish}</div>
          </div>
        )}
        <div className="mt-4 pt-3 border-t border-zinc-700 flex justify-end">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(card.question, !isBookmarked);
            }} 
            className="text-sm flex items-center gap-1.5 bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded transition-colors"
          >
            <BookmarkIcon 
              width={14} 
              height={14} 
              filled={isBookmarked}
            />
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>
      </TooltipContent>
    </Tooltip>
  </li>
));

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
  // Sidebar visibility state
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
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
  
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);
  
  const handleRevealAll = useCallback(() => {
    setRevealAll(true);
  }, []);
  
  const handleResetAll = useCallback(() => {
    // First set to false to force reset all cards
    setRevealAll(false);
    
    // Then set back to null after a short delay to allow hover flipping again
    setTimeout(() => {
      setRevealAll(null);
    }, 100);
  }, []);
  
  const handleBookmarkToggle = useCallback((question, isBookmarked) => {
    setBookmarkedCards(prev => {
      const updatedBookmarks = { ...prev, [question]: isBookmarked };
      
      // If a card is unmarked, remove it from the object to keep it clean
      if (!isBookmarked) {
        delete updatedBookmarks[question];
      }
      
      // Save to localStorage
      try {
        localStorage.setItem("flashcardBookmarks", JSON.stringify(updatedBookmarks));
      } catch (error) {
        console.error("Error saving bookmarks:", error);
      }
      
      return updatedBookmarks;
    });
  }, []);
  
  const toggleBookmarkedFilter = useCallback(() => {
    setShowBookmarkedOnly(prev => !prev);
  }, []);
  
  const toggleSidebar = useCallback(() => {
    setSidebarVisible(prev => !prev);
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={toggleSidebar}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-1.5 border ${
              sidebarVisible 
                ? "bg-teal-700/30 text-teal-300 border-teal-700 shadow-[0_0_10px_rgba(20,184,166,0.2)]" 
                : "bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700/70"
            }`}
          >
            <MenuIcon width={16} height={16} />
            {sidebarVisible ? "Hide Word List" : "Show Word List"}
          </button>
          
          <button 
            onClick={handleRevealAll}
            className="px-6 py-1.5 bg-teal-700 text-white rounded-md hover:bg-teal-600 transition-colors duration-300 border border-teal-500 shadow-[0_0_10px_rgba(100,255,218,0.3)] hover:shadow-[0_0_15px_rgba(100,255,218,0.5)]"
          >
            Reveal All Cards
          </button>
          <button 
            onClick={handleResetAll}
            className="px-6 py-1.5 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors duration-300 border border-zinc-600 hover:border-teal-500/30"
          >
            Reset All Cards
          </button>
          <button 
            onClick={toggleBookmarkedFilter}
            className={`px-5 py-1.5 rounded-md transition-colors duration-300 border flex items-center gap-2 ${
              showBookmarkedOnly 
                ? "bg-emerald-700 text-white border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                : "bg-zinc-800 text-white border-zinc-600 hover:border-emerald-500/30"
            }`}
          >
            <BookmarkIcon 
              width={16} 
              height={16} 
              filled={showBookmarkedOnly} 
              fillColor={showBookmarkedOnly ? "#10B981" : undefined}
            />
            {showBookmarkedOnly ? "All Cards" : "Bookmarked"}
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
      
      <div className="flex gap-6">
        {/* Sidebar */}
        {sidebarVisible && (
          <div className="w-56 shrink-0 sticky top-4 self-start max-h-[calc(100vh-2rem)] bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden transform-gpu">
            <div className="p-3 border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10">
              <h3 className="text-base font-medium text-teal-100 flex items-center justify-between">
                <span>Word List</span>
                <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                  {filteredCards.length}
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">Hover over a word to see details</p>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(100vh-6rem)] p-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent" style={{ direction: 'rtl' }}>
              <TooltipProvider delayDuration={150}>
                <ul className="space-y-0.5" style={{ direction: 'ltr' }}>
                  {filteredCards.map((card, index) => (
                    <SidebarItem
                      key={`${card.question}-${index}`}
                      card={card}
                      index={index}
                      isBookmarked={Boolean(bookmarkedCards[card.question])}
                      onClick={() => {}} // No click action needed for tooltips
                      onToggleBookmark={handleBookmarkToggle}
                    />
                  ))}
                </ul>
              </TooltipProvider>
              
              {filteredCards.length === 0 && (
                <div className="py-8 px-4 text-center text-zinc-400 text-sm">
                  <p>No words match current filters</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Cards Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCards.length > 0 ? (
              filteredCards.map((card, index) => (
                <Flashcard
                  key={`${card.question}-${index}`}
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
      </div>
    </div>
  );
} 