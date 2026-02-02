/*
  # Add Social Links Table

  ## Overview
  This migration adds a table for managing social media links displayed on the portfolio homepage.

  ## New Table

  ### 1. social_links
  Stores social media profile links
  - `id` (uuid, primary key) - Unique identifier
  - `platform` (text) - Platform name (e.g., 'github', 'linkedin', 'twitter')
  - `url` (text) - Profile URL
  - `icon` (text, nullable) - Icon name or URL (optional, can use lucide icons)
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS
  - Public SELECT access (needed for homepage display)
  - INSERT/UPDATE/DELETE restricted to authenticated users only
*/

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Social links policies
CREATE POLICY "Anyone can view social links"
  ON social_links FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert social links"
  ON social_links FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update social links"
  ON social_links FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete social links"
  ON social_links FOR DELETE
  TO authenticated
  USING (true);
