import { supabase } from "@/hooks/supabase"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const GoogleAuth = () => {
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}`
    }
  })
}
export const generateAnalogy = async(question: string) => {
  try {
    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",      
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: question }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const responseString = data.answer;
    const startIndex = responseString.indexOf('{');
    const endIndex = responseString.lastIndexOf('}');
    const jsonString = responseString.substring(startIndex, endIndex + 1);
    const parsedAnswer = JSON.parse(jsonString)
    return parsedAnswer
  } catch (error) {
    console.log(error)
    return error
  }
}
