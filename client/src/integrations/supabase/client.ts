import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://gemnvaszgqsyzbgitrve.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlbW52YXN6Z3FzeXpiZ2l0cnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMTA5NDYsImV4cCI6MjA2NTY4Njk0Nn0._G7DuPcm8rG6GOEK-4w6jtakqH40s4qSwZQ0vjDs9L0';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);