
import { supabase } from "../supabaseClient";
import { Question } from "@/lib/types";

export async function getQuestion(id: number): Promise<Question | null> {
 

  try {
    const { data, error } = await supabase
      .from("questions")
      .select("id,question_text, media_image, media_video") // Explicitly select the columns you need
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching question:", error);
      return null;
    }

    console.log("Fetched data:", data); // Debug log to see what we're getting

    
    const question = {
      ...data,
      correct_answer: "",
    };
    return question;
    
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}
