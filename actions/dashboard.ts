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

export async function updateProject(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const demo_link = formData.get('demo_link') as string;
  const image = formData.get('image') as File;

  if (!id || !title || !description) {
    return { error: 'ID, title, and description are required' };
  }

  const supabase = await createClient();

  let image_url = null;

  if (image && image.size > 0) {
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

    image_url = publicUrl;
  }

  const updateData: any = {
    title,
    description,
    demo_link: demo_link || null,
  };

  if (image_url) {
    updateData.image_url = image_url;
  }

  const { error } = await supabase
    .from('projects')
    .update(updateData)
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

  const { count: skillsCount } = await supabase
    .from('skills')
    .select('*', { count: 'exact', head: true });

  const { count: experiencesCount } = await supabase
    .from('experiences')
    .select('*', { count: 'exact', head: true });

  return {
    projectsCount: projectsCount || 0,
    linksCount: linksCount || 0,
    totalClicks,
    skillsCount: skillsCount || 0,
    experiencesCount: experiencesCount || 0,
  };
}

// About actions
export async function getAbout() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('about')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    return { error: error.message, data: null };
  }

  return { data };
}

export async function createAbout(formData: FormData) {
  const bio = formData.get('bio') as string;
  const image = formData.get('image') as File;

  if (!bio) {
    return { error: 'Bio is required' };
  }

  const supabase = await createClient();

  let photo_url = null;

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `about-${Date.now()}.${fileExt}`;
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

    photo_url = publicUrl;
  }

  // Delete existing about and insert new (only one entry)
  const { error: deleteError } = await supabase
    .from('about')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteError) {
    return { error: deleteError.message };
  }

  const { error: insertError } = await supabase
    .from('about')
    .insert([
      {
        bio,
        photo_url,
        updated_at: new Date().toISOString(),
      },
    ]);

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath('/');
  revalidatePath('/dashboard');

  return { success: true };
}

// Skills actions
export async function createSkill(formData: FormData) {
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const level = formData.get('level') as string;

  if (!name || !category || !level) {
    return { error: 'All fields are required' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('skills')
    .insert([
      {
        name,
        category,
        level,
      },
    ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');

  return { success: true };
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');

  return { success: true };
}

export async function getSkills() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message, data: [] };
  }

  return { data };
}

// Experiences actions
export async function createExperience(formData: FormData) {
  const title = formData.get('title') as string;
  const company = formData.get('company') as string;
  const start_date = formData.get('start_date') as string;
  const end_date = formData.get('end_date') as string;
  const description = formData.get('description') as string;

  if (!title || !company || !start_date || !description) {
    return { error: 'Title, company, start date, and description are required' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('experiences')
    .insert([
      {
        title,
        company,
        start_date,
        end_date: end_date || null,
        description,
      },
    ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');

  return { success: true };
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');

  return { success: true };
}

export async function getExperiences() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    return { error: error.message, data: [] };
  }

  return { data };
}

// SEO actions
export async function getSeo() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('seo_settings')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    return { error: error.message, data: null };
  }

  return { data };
}

export async function createSeo(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const keywords = formData.get('keywords') as string;
  const og_image = formData.get('og_image') as File;
  const twitter_card = formData.get('twitter_card') as string;

  if (!title || !description) {
    return { error: 'Title and description are required' };
  }

  const supabase = await createClient();

  let og_image_url = null;

  if (og_image && og_image.size > 0) {
    const fileExt = og_image.name.split('.').pop();
    const fileName = `seo-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, og_image, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    og_image_url = publicUrl;
  }

  // Delete existing seo and insert new (only one entry)
  const { error: deleteError } = await supabase
    .from('seo_settings')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteError) {
    return { error: deleteError.message };
  }

  const { error: insertError } = await supabase
    .from('seo_settings')
    .insert([
      {
        title,
        description,
        keywords: keywords || null,
        og_image: og_image_url,
        twitter_card: twitter_card || null,
        updated_at: new Date().toISOString(),
      },
    ]);

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath('/');
  revalidatePath('/dashboard');

  return { success: true };
}

// Social links actions
export async function createSocialLink(formData: FormData) {
  const platform = formData.get('platform') as string;
  const url = formData.get('url') as string;
  const icon = formData.get('icon') as string;

  if (!platform || !url) {
    return { error: 'Platform and URL are required' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('social_links')
    .insert([
      {
        platform,
        url,
        icon: icon || null,
      },
    ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/dashboard');

  return { success: true };
}

export async function deleteSocialLink(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('social_links')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/dashboard');

  return { success: true };
}

export async function getSocialLinks() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message, data: [] };
  }

  return { data };
}
