import { supabase } from "@/hooks/supabase"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const GoogleAuth = () => {
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/`
    }
  })
}

export const generateAnalogy = async (question: string) => {
  try {
    const prompt = `You are an expert at creating analogies to explain complex topics. 
    Explain the following topic using a creative and easy-to-understand analogy: "${question}".
    
    Structure your response as follows:
    - Start with a clear and concise title for the analogy.
    - Provide the analogy explanation using rich Markdown formatting (bolding, lists, code blocks, etc., where appropriate).
    - Ensure the response is informative yet engaging.
    
    Return the result as a JSON object with the following keys:
    "title": "A short, catchy title here",
    "answer": "The full analogy explanation in markdown format here"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Attempt to extract JSON from the response
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
      const jsonString = text.substring(startIndex, endIndex + 1);
      return JSON.parse(jsonString);
    }

    // Fallback if JSON format isn't strictly followed
    return {
      title: "Explanation",
      answer: text
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: "Error",
      answer: "Sorry, I couldn't generate an analogy at the moment. Please check your API key or connection."
    };
  }
};

export const generateGameContent = async (mode: 'reverse-riddle' | 'context-challenge' | 'wordle', topic?: string) => {
  try {
    let prompt = "";
    if (mode === 'reverse-riddle') {
      prompt = `Create a cryptic riddle about the concept: "${topic || 'a random complex scientific or philosophical concept'}". 
      Don't mention the word itself in the riddle. 
      The riddle should be poetic and challenging.
      Return JSON: {"riddle": "the riddle text", "answer": "the single word answer"}`;
    } else if (mode === 'context-challenge') {
      prompt = `Choose a complex word or concept. Give it to the user.
      Return JSON: {"word": "the word", "hint": "a small hint about its meaning"}`;
    } else if (mode === 'wordle') {
      prompt = `Generate a daily analogy wordle. Create a very cryptic analogy for a common but interesting word.
      Return JSON: {"analogy": "the cryptic analogy", "answer": "the word"}`;
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    return JSON.parse(text.substring(startIndex, endIndex + 1));
  } catch (error) {
    console.error("Game Generation Error:", error);
    return null;
  }
};

export const evaluateAnalogy = async (word: string, analogy: string) => {
  try {
    const prompt = `Evaluate the following analogy for the word: "${word}".
    Analogy: "${analogy}"
    
    Judge it based on:
    - Accuracy (Does it correctly represent the concept?)
    - Creativity (Is it an interesting comparison?)
    - Clarity (Is it easy to understand?)
    
    Return JSON: {"score": number (0-100), "feedback": "brief encouraging feedback", "isCorrect": boolean}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    return JSON.parse(text.substring(startIndex, endIndex + 1));
  } catch (error) {
    console.error("Evaluation Error:", error);
    return null;
  }
};
