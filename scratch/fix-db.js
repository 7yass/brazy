const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fix() {
  const { data, error } = await supabase.rpc('execute_sql', { sql: 'UPDATE profiles SET user_id = id WHERE user_id IS NULL;' });
  console.log("RPC result:", data, error);
  
  // If no RPC, let's just do it directly for all rows via JS
  const { data: rows } = await supabase.from('profiles').select('id').is('user_id', null);
  if (rows) {
    for (const r of rows) {
      await supabase.from('profiles').update({ user_id: r.id }).eq('id', r.id);
      console.log(`Updated user_id for ${r.id}`);
    }
  }
}

fix();
