import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aoikhsiditnurjuwejvh.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvaWtoc2lkaXRudXJqdXdlanZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDYwODM3MiwiZXhwIjoyMTA2MTg0MzcyfQ.FB-NQGDeCTg9wkmfbRd998kpKbxT8rnsa8TUKMddiFc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log('Testing Supabase connection...');
  try {
    const tables = ['profiles', 'members', 'trainers', 'membership_plans', 'memberships', 'payments', 'attendance', 'exercises', 'workout_plans', 'workout_plan_exercises', 'workout_logs', 'member_measurements', 'progress_photos', 'notifications', 'gym_settings'];
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`Table ${table}: error -> ${error.message} (${error.code})`);
      } else {
        console.log(`Table ${table}: SUCCESS (rows: ${data.length})`);
      }
    }
  } catch (err) {
    console.error('Error connecting to Supabase:', err);
  }
}

main();
