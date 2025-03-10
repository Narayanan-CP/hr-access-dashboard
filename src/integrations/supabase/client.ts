
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://inwnpxrvntyvbyodcoqa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlud25weHJ2bnR5dmJ5b2Rjb3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzU0NzksImV4cCI6MjA1NjgxMTQ3OX0.MOPWWghgFNEAmebKlb_bnbDibneW5eikliZHOxqWCvo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
