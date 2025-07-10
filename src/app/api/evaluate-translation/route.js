import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

// Initialize OpenAI client (Langchain's ChatOpenAI)
const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4-turbo-preview",
  temperature: 0.3,
});

// Define the structured output parser
const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
  rating: "The quality rating of the translation (choose exactly one: 'green', 'yellow', or 'red').",
  comment: "A brief, encouraging comment about the translation.",
  correction: "The corrected version of the translation if needed, or the original if perfect.",
  explanation: "A short explanation of any mistakes or areas for improvement.",
});

// Define the prompt template
const evaluationPromptTemplate = PromptTemplate.fromTemplate(
  `You are a helpful and encouraging language tutor specializing in German-English translation.
Provide constructive feedback on the user's translation.

{format_instructions}

Original {original_language} sentence: "{prompt}"
User's {translation_language} translation: "{translation}"

Evaluate the translation based on the original sentence.`
);

// Create the chain
const chain = evaluationPromptTemplate.pipe(model).pipe(outputParser);

export async function POST(request) {
  try {
    const { prompt, translation, direction } = await request.json();

    const original_language = direction === "en-to-de" ? "English" : "German";
    const translation_language = direction === "en-to-de" ? "German" : "English";

    // Invoke the chain with the necessary inputs
    const responseData = await chain.invoke({
      prompt: prompt,
      translation: translation,
      original_language: original_language,
      translation_language: translation_language,
      format_instructions: outputParser.getFormatInstructions(),
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error evaluating translation with Langchain:", error);
    // Fallback response in case of any error during Langchain processing
    const fallbackResponse = {
      rating: "yellow",
      comment: "We had trouble evaluating your translation automatically using Langchain.",
      correction: direction === "en-to-de"
        ? "Suggested German translation (fallback)"
        : "Suggested English translation (fallback)",
      explanation: "Please try again or consult a language reference. Error occurred during Langchain processing."
    };
    return NextResponse.json(
      fallbackResponse,
      { status: 500 }
    );
  }
}