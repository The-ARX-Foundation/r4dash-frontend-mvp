
-- Add geographical coordinates, urgency level, and skill tags to tasks table
ALTER TABLE public.tasks 
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8),
ADD COLUMN urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
ADD COLUMN skill_tags TEXT[] DEFAULT '{}';

-- Create spatial index for better performance with coordinate queries
CREATE INDEX IF NOT EXISTS idx_tasks_coordinates ON public.tasks USING btree (latitude, longitude);

-- Update existing sample tasks with coordinates (using some example locations)
UPDATE public.tasks SET 
  latitude = 40.7589, longitude = -73.9851, urgency = 'high', skill_tags = '{"physical", "elderly-care"}'
WHERE title = 'Help elderly neighbor with groceries';

UPDATE public.tasks SET 
  latitude = 40.7505, longitude = -73.9934, urgency = 'medium', skill_tags = '{"pets", "outdoor"}'
WHERE title = 'Dog walking service needed';

UPDATE public.tasks SET 
  latitude = 40.7614, longitude = -73.9776, urgency = 'low', skill_tags = '{"physical", "outdoor"}'
WHERE title = 'Yard cleanup assistance';

UPDATE public.tasks SET 
  latitude = 40.7549, longitude = -73.9840, urgency = 'medium', skill_tags = '{"technology", "teaching"}'
WHERE title = 'Computer help for senior';

UPDATE public.tasks SET 
  latitude = 40.7505, longitude = -73.9756, urgency = 'high', skill_tags = '{"physical", "moving"}'
WHERE title = 'Moving furniture';

UPDATE public.tasks SET 
  latitude = 40.7580, longitude = -73.9855, urgency = 'medium', skill_tags = '{"teaching", "academic"}'
WHERE title = 'Tutoring for math homework';
