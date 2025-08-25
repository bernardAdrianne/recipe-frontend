import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    "https://sfoyguywhcyqnxpvdexr.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmb3lndXl3aGN5cW54cHZkZXhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODcxOTA3MSwiZXhwIjoyMDY0Mjk1MDcxfQ.k-bQQ1K_eb1USXU_DtOJGRy5aUSQCCkZw5ADIzTALGE"
);
