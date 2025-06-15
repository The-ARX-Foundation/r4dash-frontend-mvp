
-- Insert sample tasks if the table is empty
INSERT INTO tasks (
  id,
  title,
  description,
  location,
  latitude,
  longitude,
  urgency,
  skill_tags,
  user_id,
  status,
  wellness_check
)
SELECT * FROM (VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Help elderly neighbor with groceries',
    'Need someone to help carry groceries from the car to the apartment on the 3rd floor. Mrs. Johnson is 85 and has trouble with heavy bags.',
    'Upper East Side, Manhattan, NYC',
    40.7739,
    -73.9554,
    'high',
    ARRAY['physical', 'elderly-care'],
    '874fa05a-4885-43f8-91ac-4bbe1d452b04',
    'open',
    false
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Dog walking service needed',
    'Looking for someone to walk my golden retriever Max while I am at work. He is friendly and well-behaved, needs about 30 minutes of walking.',
    'Central Park area, Manhattan, NYC',
    40.7829,
    -73.9654,
    'medium',
    ARRAY['pets', 'outdoor'],
    '874fa05a-4885-43f8-91ac-4bbe1d452b04',
    'open',
    false
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Computer help for senior',
    'My grandmother needs help setting up video calls to talk to family. Looking for someone patient to teach her how to use Zoom.',
    'Brooklyn Heights, NYC',
    40.6962,
    -73.9932,
    'medium',
    ARRAY['technology', 'teaching', 'elderly-care'],
    '874fa05a-4885-43f8-91ac-4bbe1d452b04',
    'open',
    false
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Wellness check needed',
    'Regular wellness check needed for Mrs. Thompson who lives alone. Just need someone to visit and ensure she is okay.',
    'Back Bay, Boston, MA',
    42.3505,
    -71.0753,
    'low',
    ARRAY['wellness-check', 'elderly-care'],
    '874fa05a-4885-43f8-91ac-4bbe1d452b04',
    'completed',
    true
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Emergency childcare needed',
    'Single parent needs urgent childcare for 6-year-old due to family emergency. Child is well-behaved and easy-going.',
    'Richmond District, San Francisco, CA',
    37.7806,
    -122.4644,
    'critical',
    ARRAY['childcare', 'emergency'],
    '874fa05a-4885-43f8-91ac-4bbe1d452b04',
    'completed',
    false
  )
) AS new_tasks(id, title, description, location, latitude, longitude, urgency, skill_tags, user_id, status, wellness_check)
WHERE NOT EXISTS (SELECT 1 FROM tasks LIMIT 1);
