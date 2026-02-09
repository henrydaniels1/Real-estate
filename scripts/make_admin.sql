-- Make a user admin
-- Replace 'USER_EMAIL_HERE' with the actual email address of the user you want to make admin

-- First, find the user ID (run this to get the user ID)
SELECT id, email FROM auth.users WHERE email = 'USER_EMAIL_HERE';

-- Then insert into admin_users table using the one-liner below instead
-- INSERT INTO admin_users (id, role) 
-- VALUES ('USER_ID_HERE', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Example usage:
-- 1. Replace 'USER_EMAIL_HERE' with actual email: admin@example.com
-- 2. Run the SELECT query to get the user ID
-- 3. Replace 'USER_ID_HERE' with the actual UUID
-- 4. Run the INSERT query

-- Use this one-liner instead (replace with actual email):
INSERT INTO admin_users (id, role) 
SELECT id, 'admin' FROM auth.users WHERE email = 'USER_EMAIL_HERE'
ON CONFLICT (id) DO UPDATE SET role = 'admin';