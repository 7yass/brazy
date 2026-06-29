const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data } = await supabase.from('profiles').select('id, updated_at, config').eq('id', 'a85ba170-f3a9-4ae8-bbda-bb9210d941d6').single();
  console.log(JSON.stringify(data.config.badges, null, 2));
}

check();
