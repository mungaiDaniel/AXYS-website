#!/usr/bin/env node

/**
 * Initialize Admin Account for AIB-AXYS
 * Creates the initial admin user: sk@horizonafrica.com
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


console.log('\n🔐 AIB-AXYS Super Admin Account Setup\n');
rl.question('Enter an email for the super admin account: ', (email) => {
  if (!email || !email.includes('@')) {
    console.log('\n❌ Please enter a valid email address.');
    process.exit(1);
  }
  rl.question('Enter a password for the super admin account: ', async (password) => {
    if (!password || password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters long');
      process.exit(1);
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/auth/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('\n✅ Super Admin account created successfully!');
        console.log('\nLogin credentials:');
        console.log('Email:', email);
        console.log(`Password: ${password}`);
        console.log('\nAccess admin panel at: http://localhost:3000/admin/login\n');
      } else {
        console.log('\n❌ Error:', data.error);
        if (data.error === 'Admin already exists') {
          console.log('Admin account already exists. Use your existing credentials to login.\n');
        }
      }
    } catch (error) {
      console.error('\n❌ Failed to create super admin:', error.message);
    }

    rl.close();
  });
});

