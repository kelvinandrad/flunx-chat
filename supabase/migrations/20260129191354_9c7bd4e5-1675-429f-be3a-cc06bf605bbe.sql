-- Confirm the new test user email
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email = 'testenovo@exemplo.com';