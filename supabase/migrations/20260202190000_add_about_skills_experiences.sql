/*
  # Add About, Skills, and Experiences Tables

  ## Overview
  This migration adds tables for portfolio about section, skills, and work experiences.

  ## New Tables

  ### 1. about
  Stores about me information with bio and photo
  - `id` (uuid, primary key) - Unique identifier
  - `bio` (text) - About me description
  - `photo_url` (text, nullable) - URL to profile photo in Supabase Storage
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. skills
  Stores technical skills with categories and proficiency levels
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Skill name (e.g., 'React', 'Node.js')
  - `category` (text) - Skill category (e.g., 'Frontend', 'Backend', 'Database')
  - `level` (text) - Proficiency level ('Beginner', 'Intermediate', 'Expert')
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. experiences
  Stores work experience entries
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Job title
  - `company` (text) - Company name
  - `start_date` (date) - Start date
  - `end_date` (date, nullable) - End date (null for current position)
  - `description` (text) - Job description
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  All tables have RLS enabled with public read access and authenticated write access.
*/

-- Create about table
CREATE TABLE IF NOT EXISTS about (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bio text NOT NULL,
  photo_url text,
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  level text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- About policies
CREATE POLICY "Anyone can view about"
  ON about FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert about"
  ON about FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update about"
  ON about FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete about"
  ON about FOR DELETE
  TO authenticated
  USING (true);

-- Skills policies
CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (true);

-- Experiences policies
CREATE POLICY "Anyone can view experiences"
  ON experiences FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert experiences"
  ON experiences FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update experiences"
  ON experiences FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete experiences"
  ON experiences FOR DELETE
  TO authenticated
  USING (true);
