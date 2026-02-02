'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createProject(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const demo_link = formData.get('demo_link') as string;
  const image = formData.get('image') as File;

  if (!title || !description || !image) {
    return { error: 'All fields are required' };
  }

  const supabase = await createClient();

  const fileExt = image.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('portfolio')
    .upload(filePath, image, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('portfolio')
    .getPublicUrl(filePath);

  const { error: insertError } = await supabase
    .from('projects')
    .insert([
      {
        title,
        description,
        image_url: publicUrl,
        demo_link: demo_link || null,
      },
    ]);

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath('/');
  revalidatePath('/dashboard');

  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/dashboard');

  return { success: true };
}

export async function createShortLink(formData: FormData) {
  const slug = formData.get('slug') as string;
  const original_url = formData.get('original_url') as string;

  if (!slug || !original_url) {
    return { error: 'Slug and URL are required' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('short_links')
    .insert([
      {
        slug: slug.toLowerCase().trim(),
        original_url,
      },
    ]);

  if (error) {
    if (error.code === '23505') {
      return { error: 'This slug already exists' };
    }
    return { error: error.message };
  }

  revalidatePath('/dashboard');

  return { success: true };
}

export async function deleteShortLink(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('short_links')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');

  return { success: true };
}

export async function getProjects() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message, data: [] };
  }

  return { data };
}

export async function getShortLinks() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('short_links')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message, data: [] };
  }

  return { data };
}

export async function getDashboardStats() {
  const supabase = await createClient();

  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  const { count: linksCount } = await supabase
    .from('short_links')
    .select('*', { count: 'exact', head: true });

  const { data: clicksData } = await supabase
    .from('short_links')
    .select('clicks');

  const totalClicks = clicksData?.reduce((acc, link) => acc + (link.clicks || 0), 0) || 0;

  return {
    projectsCount: projectsCount || 0,
    linksCount: linksCount || 0,
    totalClicks,
  };
}
