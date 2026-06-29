const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fix() {
  const userId = 'a85ba170-f3a9-4ae8-bbda-bb9210d941d6';
  
  // Get the orphan row (the one Hasura writes to, id=userId, no username)
  const { data: orphan } = await supabase.from('profiles').select('*').eq('id', userId).single();
  // Get the real row (has username y4qs)
  const { data: real } = await supabase.from('profiles').select('*').eq('user_id', userId).single();

  console.log("Orphan row (id=userId, no username):", orphan?.id, "badges:", orphan?.config?.badges?.items?.length);
  console.log("Real row (user_id=userId, username=y4qs):", real?.id, "badges:", real?.config?.badges?.items?.length);

  // Step 1: Merge the config from the orphan into the real row
  // Take the latest config (orphan has been getting all the updates)
  const mergedConfig = {
    ...real.config,
    ...orphan.config,
    // Keep the identity from real if it has a username set
    identity: {
      ...orphan.config.identity,
      ...real.config.identity,
    },
  };

  // Step 2: Update the real row with the merged config
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ config: mergedConfig })
    .eq('id', real.id);
  
  console.log("Updated real row with merged config:", updateError ? updateError : "SUCCESS");

  // Step 3: Delete the orphan row
  const { error: deleteError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  console.log("Deleted orphan row:", deleteError ? deleteError : "SUCCESS");

  // Step 4: Verify
  const { data: verify } = await supabase.from('profiles').select('id, user_id, username, updated_at').eq('user_id', userId);
  console.log("\nVerify - remaining rows for this user:", verify);
}

fix();
