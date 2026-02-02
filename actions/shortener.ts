'use server';

import { createClient } from '@supabase/supabase-js';

export async function incrementClickAndGetUrl(slug: string): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: link, error } = await supabase
    .from('short_links')
    .select('original_url, clicks')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !link) {
    return null;
  }

  await supabase
    .from('short_links')
    .update({ clicks: (link.clicks || 0) + 1 })
    .eq('slug', slug);

  return link.original_url;
}
