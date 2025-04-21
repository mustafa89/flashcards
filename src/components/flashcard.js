"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function Flashcard({ question, answer, category, sampleGerman, sampleEnglish, forceFlip, onBookmark, isBookmarked = false }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  // Handle force flip from parent component
  useEffect(() => {
    // Only override if forceFlip is not null (either true or false)
    if (forceFlip !== null) {
      setIsFlipped(forceFlip);
    } else {
      // If forceFlip is null, use hover state
      setIsFlipped(isHovering);
    }
  }, [forceFlip, isHovering]);
  
  // Initialize bookmark state from prop
  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    const newBookmarkedState = !bookmarked;
    setBookmarked(newBookmarkedState);
    
    // Notify parent component if callback provided
    if (onBookmark) {
      onBookmark(question, newBookmarkedState);
    }
  };

  return (
    <div 
      className="w-full h-full cursor-pointer group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="h-96 relative transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl overflow-hidden">
        {/* Front Side (German Word) - Dark */}
        <div 
          className={cn(
            "absolute w-full h-full transition-all duration-500",
            isFlipped ? "opacity-0 invisible rotate-y-180" : "opacity-100 visible rotate-y-0"
          )}
        >
          <Card className="h-full flex flex-col bg-[#171717] border-zinc-800 border-2 transition-all duration-300 group-hover:border-zinc-700 group-hover:shadow-[0_0_15px_rgba(100,255,218,0.3)] group-hover:border-teal-400/30 relative overflow-hidden">
            {/* Mirror shine effect - only visible on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent skew-x-[-20deg] pointer-events-none"></div>
            
            <CardHeader className="border-b border-zinc-800 pb-4">
              <CardTitle className="leading-none font-semibold flex justify-between items-center">
                <span className="text-[#FAFAFA] text-lg">German</span>
                {category && (
                  <span className="block text-sm text-zinc-400">{category}</span>
                )}
              </CardTitle>
              <div className="text-zinc-500 text-sm">Vocabulary Flashcard</div>
            </CardHeader>
            
            <CardContent className="flex-grow px-6 py-8 flex items-center justify-center">
              <div className="text-2xl font-bold text-center text-[#FAFAFA]">{question}</div>
            </CardContent>
            
            <CardFooter className="border-t border-zinc-800 pt-4 relative">
              <div className="text-xs text-zinc-500 text-center w-full">Hover to see Meaning | Bookmark {'->'}  </div>
              {/* Bookmark icon */}
              <div 
                className="absolute bottom-4 right-4 z-10 cursor-pointer bg-zinc-900/60 p-1.5 rounded-full backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900/80 hover:shadow-[0_0_10px_rgba(100,255,218,0.3)]"
                onClick={handleBookmarkClick}
                title={bookmarked ? "Remove bookmark" : "Bookmark this card"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill={bookmarked ? "#10B981" : "none"}
                  stroke={bookmarked ? "#10B981" : "#6B7280"} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="transition-all duration-300 hover:stroke-teal-400"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Back Side (English Translation) - Dark teal gradient */}
        <div 
          className={cn(
            "absolute w-full h-full transition-all duration-500",
            isFlipped ? "opacity-100 visible rotate-y-0" : "opacity-0 invisible rotate-y-180"
          )}
        >
          <Card className="h-full flex flex-col bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-teal-50 border-teal-700 border-2 transition-all duration-300 group-hover:border-teal-400 group-hover:shadow-[0_0_20px_rgba(100,255,218,0.5)] relative overflow-hidden">
            {/* Mirror shine effect - only visible on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent skew-x-[-20deg] pointer-events-none"></div>
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
            
            {/* Four corner accent borders that glow on hover */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-teal-400/30 group-hover:border-teal-400 transition-all duration-300 group-hover:opacity-100 opacity-30"></div>
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-teal-400/30 group-hover:border-teal-400 transition-all duration-300 group-hover:opacity-100 opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-teal-400/30 group-hover:border-teal-400 transition-all duration-300 group-hover:opacity-100 opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-teal-400/30 group-hover:border-teal-400 transition-all duration-300 group-hover:opacity-100 opacity-30"></div>
            
            <CardHeader className="border-b border-teal-700/50 pb-4">
              <CardTitle className="leading-none font-semibold flex justify-between items-center">
                <span className="text-teal-200 text-lg">English</span>
                {category && (
                  <span className="block text-sm text-teal-300/80">{category}</span>
                )}
              </CardTitle>
              <div className="text-teal-300/70 text-sm">Translation</div>
            </CardHeader>
            
            <CardContent className="flex-grow px-6 pt-6 pb-2 flex flex-col relative z-10">
              <div className="text-2xl font-medium text-center mb-auto text-teal-50">{answer}</div>
              
              {sampleGerman && (
                <div className="mt-4 backdrop-blur-sm bg-teal-900/30 p-3 rounded-md border border-teal-500/20 group-hover:border-teal-500/40 transition-all duration-300">
                  <div className="text-base text-teal-200 font-medium">
                    &ldquo;{sampleGerman}&rdquo;
                  </div>
                  <div className="text-sm text-teal-300/90 italic mt-1">
                    &ldquo;{sampleEnglish}&rdquo;
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="border-t border-teal-700/50 pt-4 relative">
              <div className="text-xs text-teal-300/80 text-center w-full">Release hover to return</div>
              
              {/* Bookmark icon */}
              <div 
                className="absolute bottom-4 right-4 z-10 cursor-pointer bg-teal-900/60 p-1.5 rounded-full backdrop-blur-sm transition-all duration-300 hover:bg-teal-800/80 hover:shadow-[0_0_10px_rgba(100,255,218,0.5)]"
                onClick={handleBookmarkClick}
                title={bookmarked ? "Remove bookmark" : "Bookmark this card"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill={bookmarked ? "#10B981" : "none"}
                  stroke={bookmarked ? "#10B981" : "#E2E8F0"} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="transition-all duration-300 hover:stroke-teal-300"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 