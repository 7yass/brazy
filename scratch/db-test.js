const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  // Get ALL profiles
  const { data: all } = await supabase.from('profiles').select('id, user_id, username, updated_at');
  console.log("ALL profiles:");
  for (const p of all) {
    console.log(`  id=${p.id}  user_id=${p.user_id}  username=${p.username}  updated=${p.updated_at}`);
  }

  // Now check: which one has the badges?
  for (const p of all) {
    const { data: full } = await supabase.from('profiles').select('config').eq('id', p.id).single();
    const badges = full?.config?.badges;
    if (badges && badges.items && badges.items.length > 0) {
      console.log(`\nProfile ${p.id} (username=${p.username}) has ${badges.items.length} badges:`);
      console.log(JSON.stringify(badges, null, 2));
    }
  }
}

check();
