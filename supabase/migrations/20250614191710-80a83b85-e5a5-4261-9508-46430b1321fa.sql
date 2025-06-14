
-- Step 1: Explicitly drop each policy one by one
DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own pending tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Admins can view all tasks" ON tasks;
DROP POLICY IF EXISTS "Admins can verify tasks" ON tasks;
DROP POLICY IF EXISTS "Anyone can view open tasks" ON tasks;

-- Step 2: Add the missing columns
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS claimed_by UUID,
ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP WITH TIME ZONE;

-- Step 3: Remove the default value that depends on the enum
ALTER TABLE tasks ALTER COLUMN status DROP DEFAULT;

-- Step 4: Convert column to text temporarily
ALTER TABLE tasks ALTER COLUMN status TYPE TEXT;

-- Step 5: Drop the old enum (now it should work since we removed dependencies)
DROP TYPE IF EXISTS task_status;

-- Step 6: Create the new enum with all required values
CREATE TYPE task_status AS ENUM ('open', 'claimed', 'completed', 'pending', 'verified', 'flagged');

-- Step 7: Convert the column back to use the new enum
ALTER TABLE tasks ALTER COLUMN status TYPE task_status USING status::task_status;

-- Step 8: Set the proper default value back
ALTER TABLE tasks ALTER COLUMN status SET DEFAULT 'open'::task_status;

-- Step 9: Update any existing tasks that might have NULL status
UPDATE tasks SET status = 'open'::task_status WHERE status IS NULL;

-- Step 10: Recreate the RLS policies with unique names
CREATE POLICY "Users can view their own tasks v2" ON tasks
FOR SELECT USING (auth.uid() = user_id OR auth.uid() = volunteer_id OR auth.uid() = claimed_by);

CREATE POLICY "Users can create their own tasks v2" ON tasks
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks v2" ON tasks
FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = volunteer_id OR auth.uid() = claimed_by);

CREATE POLICY "Anyone can view open tasks v2" ON tasks
FOR SELECT USING (status = 'open');

CREATE POLICY "Admins can view all tasks v2" ON tasks
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can verify tasks v2" ON tasks
FOR UPDATE USING (is_admin(auth.uid()));
