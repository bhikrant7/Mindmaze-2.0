export interface LeaderboardEntry {
    team_id: number;
    team_name: string;
    total_score: number | string; // Can be a number or a string (to handle edge cases)
    rank?: number; // Optional property
  }
  