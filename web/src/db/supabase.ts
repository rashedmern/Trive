import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://psqmktpdzkuphypqkbza.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcW1rdHBkemt1cGh5cHFrYnphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMzQ0MzYsImV4cCI6MjA1NTYxMDQzNn0.74Q7G-zQjU3tQ86vP4k6cR1v5Y6Y9M0tE8X5y6z7w0E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
