import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  process.env.https://fmlhfuehixtferjlvzcr.supabase.co,
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtbGhmdWVoaXh0ZmVyamx2emNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5Mjc5MjcsImV4cCI6MjA0ODUwMzkyN30.roSS3DTmdgikM7-ieFUvincxdqh-wNQRh7OsaBrGj-M
)