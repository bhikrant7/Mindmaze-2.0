export type UUID = number; // For team IDs

// Teams Table
export interface Team {
  id?: UUID;
  team_name: string;
  password: string;
  email:string;
  refresh_token?: string | null;
  current_question_id?: number | 0; //random 4 digit number assign to each team to mark their question answer id
  questions_solved?: number | 0;
  has_submitted?: boolean | false;
  session_count?: number|0;
}


// Questions Table
export interface Question {
  id: number;
  question_text: string;
  media_image?: string; // URL of image (optional)
  media_video?: string; // URL of video (optional)
  correct_answer?: string;
  user_answer?: string;
}

// Submissions Table
export interface Submission {
  id: number;
  team_id: UUID;
  question_id: number;
  submitted_answer: string;
  is_correct: boolean;
  submitted_at: string; // Timestamp
}

// Solved Questions Table
export interface SolvedQuestion {
  id: number;
  team_id: UUID;
  question_id: number;
  solved_at: string; // Timestamp
}

// Leaderboard Table
export interface Leaderboard {
  team_id: UUID;
  total_score: number;
  rank?: number; // Nullable
}

// Supabase Database Schema Type
export interface Database {
  teams: Team;
  questions: Question;
  submissions: Submission;
  solved_questions: SolvedQuestion;
  leaderboard: Leaderboard;
}
