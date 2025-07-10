"use client";

import { useState, useRef } from "react";
import { Loader2, RefreshCcw, Send, Volume2 } from "lucide-react";
import React from "react";

export default function WritingPractice() {
  const [prompt, setPrompt] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [direction, setDirection] = useState("en-to-de"); // en-to-de or de-to-en
  const [previousSentences, setPreviousSentences] = useState([]);
  const inputRef = useRef(null);
  
  // Load previous sentences from sessionStorage on component mount
  React.useEffect(() => {
    const storedSentences = sessionStorage.getItem('previousSentences');
    if (storedSentences) {
      try {
        setPreviousSentences(JSON.parse(storedSentences));
      } catch (e) {
        console.error("Error parsing stored sentences:", e);
      }
    }
  }, []);
  
  // Save sentences to sessionStorage when they change
  React.useEffect(() => {
    if (previousSentences.length > 0) {
      sessionStorage.setItem('previousSentences', JSON.stringify(previousSentences));
    }
  }, [previousSentences]);
  
  // Generate a new sentence to translate
  const generateSentence = async () => {
    setIsGenerating(true);
    setFeedback(null);
    setUserInput("");
    
    try {
      // In a production app, you would call your API route here
      const response = await fetch("/api/generate-sentence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          direction,
          timestamp: new Date().getTime(), // Add timestamp to prevent caching
          avoid: previousSentences.slice(-5) // Send 5 most recent sentences to avoid
        })
      });
      
      if (!response.ok) throw new Error("Failed to generate sentence");
      
      const data = await response.json();
      
      // Store this sentence to avoid repetition
      if (data.sentence && !previousSentences.includes(data.sentence)) {
        setPreviousSentences(prev => [...prev.slice(-19), data.sentence]); // Keep last 20 sentences
      }
      
      setPrompt(data.sentence);
    } catch (error) {
      console.error("Error generating sentence:", error);
      // Show a placeholder for development
      setPrompt(direction === "en-to-de" 
        ? "The cat is sleeping on the chair." 
        : "Die Katze schläft auf dem Stuhl.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Evaluate the user's translation
  const evaluateTranslation = async () => {
    if (!userInput.trim()) return;
    
    setIsEvaluating(true);
    
    try {
      // In a production app, you would call your API route here
      const response = await fetch("/api/evaluate-translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt, 
          translation: userInput,
          direction
        })
      });
      
      if (!response.ok) throw new Error("Failed to evaluate translation");
      
      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error("Error evaluating translation:", error);
      // Mock feedback for development
      setFeedback({
        rating: ["green", "yellow", "red"][Math.floor(Math.random() * 3)],
        comment: "This is placeholder feedback since we're not connected to an API yet.",
        correction: direction === "en-to-de" 
          ? "Die Katze schläft auf dem Stuhl." 
          : "The cat is sleeping on the chair.",
        explanation: "Here's what makes this translation work well..."
      });
    } finally {
      setIsEvaluating(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    evaluateTranslation();
  };
  
  // Initialize with a sentence on first load
  if (!prompt && !isGenerating) {
    generateSentence();
  }
  
  // Text-to-speech function (browser API)
  const speakText = (text) => {
    if (!text) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = direction.startsWith("en") ? "de-DE" : "en-US";
    window.speechSynthesis.speak(utterance);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-teal-400">Writing Practice</h1>
        <p className="text-zinc-400 max-w-2xl">
          Practice translating sentences between English and German. Get AI-powered feedback on your translations.
        </p>
      </header>
      
      <div className="max-w-2xl mx-auto">
        {/* Language direction selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-zinc-900 rounded-lg p-1 inline-flex">
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                direction === "en-to-de" 
                  ? "bg-zinc-800 text-teal-400" 
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              onClick={() => {
                setDirection("en-to-de");
                setFeedback(null);
                setUserInput("");
                setTimeout(generateSentence, 100);
              }}
            >
              English → German
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                direction === "de-to-en" 
                  ? "bg-zinc-800 text-teal-400" 
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              onClick={() => {
                setDirection("de-to-en");
                setFeedback(null);
                setUserInput("");
                setTimeout(generateSentence, 100);
              }}
            >
              German → English
            </button>
          </div>
        </div>
        
        {/* Sentence to translate */}
        <div className="bg-zinc-900 rounded-lg p-6 mb-4 relative">
          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-zinc-500">
                  {direction === "en-to-de" ? "English" : "German"}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => speakText(prompt)}
                    className="p-1 text-zinc-400 hover:text-teal-400 transition-colors"
                    aria-label="Listen to pronunciation"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={generateSentence}
                    className="p-1 text-zinc-400 hover:text-teal-400 transition-colors"
                    aria-label="Generate new sentence"
                  >
                    <RefreshCcw className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-xl text-zinc-100">{prompt}</p>
            </>
          )}
        </div>
        
        {/* Translation input */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="bg-zinc-900 rounded-lg p-6 mb-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-zinc-500">
                {direction === "en-to-de" ? "German" : "English"}
              </span>
            </div>
            <div className="flex">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`Type your ${direction === "en-to-de" ? "German" : "English"} translation here...`}
                className="flex-grow bg-transparent border-b border-zinc-700 focus:border-teal-400 pb-2 text-xl text-zinc-100 outline-none transition-colors"
                disabled={isGenerating || isEvaluating}
              />
              <button
                type="submit"
                disabled={!userInput.trim() || isEvaluating || isGenerating}
                className="ml-2 p-2 rounded-full bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-500 transition-colors"
              >
                {isEvaluating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </form>
        
        {/* Feedback section */}
        {feedback && (
          <div className={`bg-zinc-900 rounded-lg p-6 mb-4 border-l-4 ${
            feedback.rating === "green" ? "border-green-500" :
            feedback.rating === "yellow" ? "border-yellow-500" : 
            "border-red-500"
          }`}>
            <h3 className="text-lg font-medium mb-2 text-zinc-100">Feedback</h3>
            <p className="mb-4 text-zinc-300">{feedback.comment}</p>
            
            {feedback.correction && (
              <div className="mb-4">
                <div className="text-sm font-medium text-zinc-500 mb-1">Suggested translation:</div>
                <p className="text-teal-400">{feedback.correction}</p>
              </div>
            )}
            
            {feedback.explanation && (
              <div>
                <div className="text-sm font-medium text-zinc-500 mb-1">Explanation:</div>
                <p className="text-zinc-300">{feedback.explanation}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-8">
          <button
            onClick={generateSentence}
            disabled={isGenerating}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-md transition-colors flex items-center mx-auto"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            New Sentence
          </button>
        </div>
      </div>
    </div>
  );
} 