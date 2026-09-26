const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://iuodnzgwlolmeospcqvx.supabase.co',
  'sb_publishable_BMhzYHlse240vIzJX6-mBw_JPJh0jJ5'
);

async function testInsert() {
  console.log("Testing insert...");
  const { data, error } = await supabase.from('app_state').upsert({ key: 'test', data: { hello: 'world' } }, { onConflict: 'key' });
  console.log('Error:', error);
  console.log('Data:', data);
}

testInsert();
