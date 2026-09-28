import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://aoikhsiditnurjuwejvh.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('Connecting to Supabase at:', SUPABASE_URL);

async function main() {
  console.log('Supabase backend client initialized.');
  console.log('Ready to synchronize live data through /api endpoints.');
}

main();
