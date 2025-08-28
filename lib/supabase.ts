import { createClient } from '@supabase/supabase-js';

// Always use the environment variables directly
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eetwjfmnrfgmekqjdvfi.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVldHdqZm1ucmZnbWVrcWpkdmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MjA5ODMsImV4cCI6MjA2NTI5Njk4M30.4ybLNjKTuafZKjJ8XhqvSsCdaLaOav6BkM9gwftOGAw';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);