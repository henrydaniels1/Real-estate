# Admin Access Guide

## How to Access the Admin Panel

### 1. First, run the database migrations
Make sure you've run all the SQL scripts in the `scripts/` folder:
- `001_create_tables.sql`
- `002_update_images.sql` 
- `003_add_rental_and_blog.sql`
- `004_mark_featured.sql`
- `005_admin_tables.sql`

### 2. Create an admin user

#### Option A: Using the JavaScript utility (Recommended)
```bash
node scripts/make-admin.js your-email@example.com
```

#### Option B: Using SQL directly
Use the `scripts/make_admin.sql` file:
1. Open `scripts/make_admin.sql`
2. Replace `'USER_EMAIL_HERE'` with the actual email address
3. Run the query in your Supabase SQL editor:
```sql
INSERT INTO admin_users (id, role) 
SELECT id, 'admin' FROM auth.users WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

#### Option C: Make the first registered user an admin
```sql
INSERT INTO admin_users (id, role)
SELECT id, 'super_admin'
FROM auth.users
ORDER BY created_at ASC
LIMIT 1
ON CONFLICT (id) DO NOTHING;
```

### 3. Access the admin panel
1. Sign up/Login to your account at `/auth/login`
2. Once logged in, navigate to `/admin`
3. You should now see the admin dashboard

## Admin Features

The admin panel includes:
- **Dashboard**: Overview of site statistics
- **Hero Section**: Manage homepage hero content
- **Properties**: Manage all property listings
- **Testimonials**: Manage customer testimonials
- **Blog Posts**: Create and manage blog content
- **Services**: Manage service offerings
- **FAQs**: Manage frequently asked questions
- **Media Library**: Upload and manage images
- **Users**: View all registered users
- **Settings**: Manage site-wide settings

## Admin Roles

- **super_admin**: Full access to all features including user management
- **admin**: Access to content management (properties, blog, etc.) 
- **editor**: Limited access to content editing

## Quick Reference Commands

### Make user admin (recommended method)
```sql
INSERT INTO admin_users (id, role) 
SELECT id, 'admin' FROM auth.users WHERE email = 'user@example.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

### Check admin status
```sql
SELECT email, role FROM auth.users u 
JOIN admin_users a ON u.id = a.id 
WHERE email = 'user@example.com';
```

### Remove admin access
```sql
DELETE FROM admin_users WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);
```

## Security Considerations

- Admin access should only be granted to trusted users
- Regularly audit admin users and remove unnecessary access
- Use strong passwords and enable 2FA when available
- Monitor admin activity through application logs

## Database Schema

The admin system uses these key tables:
- `admin_users`: Stores admin user IDs and roles
- `auth.users`: Supabase authentication users

## Troubleshooting

### "Access Denied" or redirected to home page
- Make sure you're logged in
- Verify your user ID exists in the `admin_users` table
- Check that the `admin_users` table has the correct structure
- Clear browser cache and cookies

### Common SQL Errors
- **UUID syntax error**: Don't use placeholder text like 'USER_ID_HERE' - use actual email-based queries
- **User not found**: Ensure the user has registered an account first
- **Permission denied**: Check RLS policies on admin tables

### Check if you're an admin
Run this SQL query:
```sql
SELECT u.email, a.role, a.created_at
FROM auth.users u
JOIN admin_users a ON u.id = a.id
WHERE u.email = 'your-email@example.com';
```

### List all admin users
```sql
SELECT u.email, a.role, a.created_at
FROM auth.users u
JOIN admin_users a ON u.id = a.id
ORDER BY a.created_at DESC;
```

### Remove admin access
```sql
DELETE FROM admin_users WHERE id = (
  SELECT id FROM auth.users WHERE email = 'user-email@example.com'
);
```

## Process Continuation

If a process gets interrupted:
1. Check what was completed by reviewing database tables
2. Run verification queries to see current state
3. Continue from the next logical step
4. Use incremental approaches for large operations

**Why processes take long:**
- Large database operations
- Network latency with Supabase
- Complex queries with joins
- File I/O operations

**To continue interrupted processes:**
- Always use `ON CONFLICT` clauses for idempotent operations
- Break large operations into smaller chunks
- Use transaction blocks for related operations
- Keep logs of what was completed