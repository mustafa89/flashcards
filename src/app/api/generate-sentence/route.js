import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Initialize OpenAI client (Langchain's ChatOpenAI)
const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.9,
  // frequency_penalty and presence_penalty are not direct constructor args for ChatOpenAI
  // They are passed in .invoke() or as part of modelKwargs if needed, but StringOutputParser won't use them.
  // For simple generation, temperature is often enough to manage variety.
  // We can add frequency/presence penalties in the .invoke call if necessary.
});

const outputParser = new StringOutputParser();

// Define the prompt template
const sentencePromptTemplate = PromptTemplate.fromTemplate(
  `You are a helpful language tutor specializing in German-English translation practice.
For each request, you should generate a unique, interesting sentence that hasn't been used before.
Vary the topics, vocabulary, and sentence structures.

Generate a simple {language} sentence (not more than 10 words) that would be appropriate for a language learner to translate to {targetLanguage}.
The sentence should use common vocabulary and basic grammar.
DO NOT repeat previously generated sentences - create something fresh and unique.
Try to vary the topics, verb tenses, and sentence structures.
{avoidListPromptSection}
Return only the {language} sentence without any additional text or explanation.`
);

export async function POST(request) {
  try {
    const requestData = await request.json();
    const { direction, avoid = [] } = requestData;

    const language = direction === "en-to-de" ? "English" : "German";
    const targetLanguage = direction === "en-to-de" ? "German" : "English";

    const avoidListPromptSection = avoid.length > 0
      ? `\n\nAVOID these exact sentences that were recently used (generate something completely different):\n${avoid.map(s => `- "${s}"`).join('\n')}`
      : '';

    // Create the chain
    const chain = sentencePromptTemplate.pipe(model).pipe(outputParser);

    // Invoke the chain
    // Note: frequency_penalty and presence_penalty can be passed via .bind or modelKwargs in ChatOpenAI
    // For ChatOpenAI, it's often cleaner to use .bind if these are consistently needed:
    // const modelWithPenalties = model.bind({ model_kwargs: { frequency_penalty: 0.8, presence_penalty: 0.6 } });
    // const chain = sentencePromptTemplate.pipe(modelWithPenalties).pipe(outputParser);
    // Or directly in invoke if less frequent:
    const sentence = await chain.invoke({
      language: language,
      targetLanguage: targetLanguage,
      avoidListPromptSection: avoidListPromptSection,
      // For model specific parameters like frequency_penalty with .invoke, they are typically passed with the model call itself
      // or through a RunnableConfig if the LLM supports it. With the basic .pipe structure, they are not directly passed
      // in .invoke for the chain unless the model itself is configured to accept them this way or through .bind().
      // The ChatOpenAI class itself has parameters for this, or you can use model_kwargs for more esoteric ones.
      // Let's assume temperature is sufficient for now, or penalties can be added to ChatOpenAI constructor directly or via .bind().
    });

    return NextResponse.json({ sentence: sentence.trim() });
  } catch (error) {
    console.error("Error generating sentence with Langchain:", error);
    return NextResponse.json(
      { error: "Failed to generate sentence with Langchain" },
      { status: 500 }
    );
  }
}