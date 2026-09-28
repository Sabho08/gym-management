import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://aoikhsiditnurjuwejvh.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvaWtoc2lkaXRudXJqdXdlanZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MDgzNzIsImV4cCI6MjEwNjE4NDM3Mn0.DSsSJWweRky-aZwNOlLm9PoYJFEvi486GrJZOGdwr8Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
