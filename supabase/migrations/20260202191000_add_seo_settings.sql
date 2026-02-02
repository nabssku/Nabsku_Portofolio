/*
  # Add SEO Settings Table

  ## Overview
  This migration adds a table for managing global SEO settings for the portfolio website.

  ## New Table

  ### 1. seo_settings
  Stores SEO metadata for the website
  - `id` (uuid, primary key) - Unique identifier (only one row expected)
  - `title` (text) - Page title
  - `description` (text) - Meta description
  - `keywords` (text) - Meta keywords (comma-separated)
  - `og_image` (text, nullable) - Open Graph image URL
  - `twitter_card` (text, nullable) - Twitter card type
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS
  - Public SELECT access (needed for SEO meta tags)
  - INSERT/UPDATE/DELETE restricted to authenticated users only
*/

-- Create seo_settings table
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  keywords text,
  og_image text,
  twitter_card text,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- SEO settings policies
CREATE POLICY "Anyone can view seo settings"
  ON seo_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert seo settings"
  ON seo_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update seo settings"
  ON seo_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete seo settings"
  ON seo_settings FOR DELETE
  TO authenticated
  USING (true);
