
-- Add enum for task status (skip if exists)
DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('pending', 'verified', 'flagged');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new columns to existing tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS status task_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS volunteer_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Update the user_id column to be volunteer_id reference for clarity
UPDATE tasks SET volunteer_id = user_id WHERE volunteer_id IS NULL;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own pending tasks" ON tasks;
DROP POLICY IF EXISTS "Admins can view all tasks" ON tasks;
DROP POLICY IF EXISTS "Admins can verify tasks" ON tasks;

-- Create admin check function
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- For demo purposes, we'll make the demo-user-id an admin
  -- In production, you'd have a proper roles table
  RETURN user_uuid::text = 'demo-user-id' OR user_uuid::text = 'admin-user-id';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policies for task management
CREATE POLICY "Users can view their own tasks" ON tasks
FOR SELECT USING (auth.uid() = volunteer_id);

CREATE POLICY "Users can create their own tasks" ON tasks
FOR INSERT WITH CHECK (auth.uid() = volunteer_id);

CREATE POLICY "Users can update their own pending tasks" ON tasks
FOR UPDATE USING (auth.uid() = volunteer_id AND status = 'pending');

CREATE POLICY "Admins can view all tasks" ON tasks
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can verify tasks" ON tasks
FOR UPDATE USING (is_admin(auth.uid()));

-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for task images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('task-images', 'task-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist, then recreate them
DROP POLICY IF EXISTS "Users can upload task images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view task images" ON storage.objects;

-- Create storage policies
CREATE POLICY "Users can upload task images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'task-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view task images" ON storage.objects
FOR SELECT USING (bucket_id = 'task-images');
