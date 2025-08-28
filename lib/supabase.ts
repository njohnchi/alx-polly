import { createClient } from '@supabase/supabase-js';

// This approach prevents errors during build time and server-side rendering
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // In case environment variables are not available (e.g., during SSR)
  // Use default values or handle gracefully
  if (typeof window !== 'undefined') {
    console.error('Supabase environment variables are missing');
  }
  supabaseUrl = supabaseUrl || 'https://eetwjfmnrfgmekqjdvfi.supabase.co';
  supabaseAnonKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVldHdqZm1ucmZnbWVrcWpkdmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MjA5ODMsImV4cCI6MjA2NTI5Njk4M30.4ybLNjKTuafZKjJ8XhqvSsCdaLaOav6BkM9gwftOGAw';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);