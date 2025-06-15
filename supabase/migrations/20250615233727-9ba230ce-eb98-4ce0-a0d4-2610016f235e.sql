
-- Update the test user to have coordinator role
UPDATE profiles 
SET role = 'coordinator', updated_at = now()
WHERE user_id = '874fa05a-4885-43f8-91ac-4bbe1d452b04';
