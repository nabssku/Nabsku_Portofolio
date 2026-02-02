/*
  # Portfolio Website Database Schema
  
  ## Overview
  This migration creates the complete database schema for a portfolio website with link shortener functionality.
  
  ## New Tables
  
  ### 1. projects
  Stores portfolio projects with images and links
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Project title
  - `description` (text) - Project description
  - `image_url` (text) - URL to project image in Supabase Storage
  - `demo_link` (text, nullable) - Link to live demo
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 2. short_links
  Stores shortened URLs with click tracking
  - `id` (uuid, primary key) - Unique identifier
  - `slug` (text, unique) - Short URL slug
  - `original_url` (text) - Target URL
  - `clicks` (integer) - Click counter
  - `created_at` (timestamptz) - Creation timestamp
  
  ## Security
  
  ### Projects Table
  - Enable RLS
  - Public SELECT access (anyone can view projects)
  - INSERT/UPDATE/DELETE restricted to authenticated users only
  
  ### Short Links Table
  - Enable RLS
  - Public SELECT access (needed for redirect lookups)
  - INSERT/UPDATE/DELETE restricted to authenticated users only
  
  ## Notes
  - Click increments are handled via service role to bypass RLS
  - All tables use UUID for primary keys
  - Timestamps use timestamptz for timezone awareness
  - Default values set for counters and timestamps
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  demo_link text,
  created_at timestamptz DEFAULT now()
);

-- Create short_links table
CREATE TABLE IF NOT EXISTS short_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  original_url text NOT NULL,
  clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_links ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Short links policies
CREATE POLICY "Anyone can view short links"
  ON short_links FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert short links"
  ON short_links FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update short links"
  ON short_links FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete short links"
  ON short_links FOR DELETE
  TO authenticated
  USING (true);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_short_links_slug ON short_links(slug);