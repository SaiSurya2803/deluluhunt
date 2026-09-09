import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iuodnzgwlolmeospcqvx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_BMhzYHlse240vIzJX6-mBw_JPJh0jJ5';

export const supabase = createClient(supabaseUrl, supabaseKey);
