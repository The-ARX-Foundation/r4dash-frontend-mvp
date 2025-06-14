
-- Update RLS policies to allow better task visibility

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own tasks v2" ON tasks;
DROP POLICY IF EXISTS "Anyone can view open tasks v2" ON tasks;
DROP POLICY IF EXISTS "Users can create their own tasks v2" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks v2" ON tasks;
DROP POLICY IF EXISTS "Admins can view all tasks v2" ON tasks;
DROP POLICY IF EXISTS "Admins can verify tasks v2" ON tasks;

-- Create new policies with better visibility
CREATE POLICY "Users can view their own tasks v3" ON tasks
FOR SELECT USING (auth.uid() = user_id OR auth.uid() = volunteer_id OR auth.uid() = claimed_by);

CREATE POLICY "Anyone can view open and verified tasks v3" ON tasks
FOR SELECT USING (status IN ('open', 'verified'));

CREATE POLICY "Users can create their own tasks v3" ON tasks
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks v3" ON tasks
FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = volunteer_id OR auth.uid() = claimed_by);

CREATE POLICY "Admins can view all tasks v3" ON tasks
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can verify tasks v3" ON tasks
FOR UPDATE USING (is_admin(auth.uid()));

-- Add a policy to allow anonymous access to open/verified tasks (for seeding)
CREATE POLICY "Allow anonymous access to open tasks v3" ON tasks
FOR SELECT USING (status IN ('open', 'verified'));

-- Enable RLS if not already enabled
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
