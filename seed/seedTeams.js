// seedTeams.js
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
// Initialize Supabase client
const supabase = createClient(
    'https://ownmtacmeyglmfaoieaq.supabase.co',
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93bm10YWNtZXlnbG1mYW9pZWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5Mzc2MDIsImV4cCI6MjA1NzUxMzYwMn0.ZTyyjPHg901TqUloz_fgaNSqc_4CZzvJbdw1AkN7C9w"
);

const teams = [
  {
    team_name: "A",
    email: "test@example.com",
    password: "SecurePassword123!",
    current_question_id: 1,
    questions_solved: 0,
    has_submitted: false,
  },
//   {
//     team_name: "B",
//     email: "beta@example.com",
//     password: "SecurePassword456!",
//     current_question_id: 1,
//     questions_solved: 0,
//     has_submitted: false,
//   },
];
async function seedTeams() {
    try {
      for (const team of teams) {
        // 1. Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: team.email,
          password: team.password,
          options: {
            email_confirm: true,
            data: {
              team_name: team.team_name,
            },
          },
        });
  
        if (authError) {
          console.error(`❌ Auth error for ${team.email}:`, authError.message);
          continue;
        }
  
        // 2. Create team record in public table
        const { error: dbError } = await supabase
          .from('teams')
          .insert({
            user_id: authData.user.id,
            team_name: team.team_name,
            current_question_id: team.current_question_id,
            questions_solved: team.questions_solved,
            has_submitted: team.has_submitted,
          });
  
        if (dbError) {
          console.error(`❌ DB error for ${team.team_name}:`, dbError.message);
          await supabase.auth.admin.deleteUser(authData.user.id);
          continue;
        }
  
        console.log(`✅ Successfully seeded ${team.team_name} (${authData.user.id})`);
      }
      
      console.log('🎉 Seeding completed!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    }
  }
  
  seedTeams();