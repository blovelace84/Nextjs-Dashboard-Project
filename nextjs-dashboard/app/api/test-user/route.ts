import { NextResponse } from 'next/server';
import postgres from 'postgres';
import bcrypt from 'bcrypt';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
  }

  try {
    const users = await sql`SELECT id, name, email, password FROM users WHERE email = ${email}`;
    
    if (users.length === 0) {
      return NextResponse.json({ 
        found: false, 
        message: 'User not found in database' 
      });
    }

    const user = users[0];
    
    // Test password hash
    const testPassword = '123456'; // Replace with the password you used
    const matches = await bcrypt.compare(testPassword, user.password);

    return NextResponse.json({
      found: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHashLength: user.password.length,
        passwordStartsWith: user.password.substring(0, 7),
      },
      testPasswordMatches: matches,
      message: 'User found. Check if test password matches.'
    });
  } catch (error) {
    console.error('Test user error:', error);
    return NextResponse.json({ error: 'Database error', details: String(error) }, { status: 500 });
  }
}
