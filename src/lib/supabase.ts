import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gemnvaszgqsyzbgitrve.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlbW52YXN6Z3FzeXpiZ2l0cnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMTA5NDYsImV4cCI6MjA2NTY4Njk0Nn0._G7DuPcm8rG6GOEK-4w6jtakqH40s4qSwZQ0vjDs9L0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 