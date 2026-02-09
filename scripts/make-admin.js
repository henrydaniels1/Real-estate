const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function makeAdmin(email) {
  try {
    // Find user by email
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      console.error('Error fetching users:', userError)
      return
    }

    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      console.error('User not found with email:', email)
      return
    }

    // Add user to admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        { id: user.id, role: 'super_admin' }
      ])
      .select()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        console.log('User is already an admin')
      } else {
        console.error('Error making user admin:', error)
      }
      return
    }

    console.log('Successfully made user admin:', email)
    console.log('Admin data:', data)
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Get email from command line argument
const email = process.argv[2]

if (!email) {
  console.log('Usage: node make-admin.js <email>')
  console.log('Example: node make-admin.js user@example.com')
  process.exit(1)
}

makeAdmin(email)