import { createClient } from '@supabase/supabase-js'

// Using the provided project URL and publishable key
const supabaseUrl = 'https://ocgnbreviaonzebrjoxd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZ25icmV2aWFvbnplYnJqb3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzE1MTksImV4cCI6MjA5NDc0NzUxOX0.uQ9WANJ3Vjj3QZZWIOI0FC2Wck4iJxp0aROqnw6Lnpk'

export const supabase = createClient(supabaseUrl, supabaseKey)
