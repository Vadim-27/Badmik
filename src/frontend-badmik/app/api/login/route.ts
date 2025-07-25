
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;


  const users = {
    'admin@example.com': {
      id: 'admin-id-1',
      password: 'admin123',
      role: 'admin',
      accessLevel: 'full',
      permissions: ['view_users', 'manage_settings'], 
    },
    'admin2@example.com': {
      id: 'admin-id-2',
      password: 'admin123',
      role: 'admin',
      accessLevel: 'limited',
      permissions: ['view_users'], 
    },
  };

  const user = users[email as keyof typeof users];

  if (!user || password !== user.password) {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }

 
  const token = jwt.sign(
    {
      sub: user.id,
      email,
      role: user.role,
      accessLevel: user.accessLevel,
      permissions: user.permissions,
    },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  const res = NextResponse.json({ success: true });

 
  res.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 2,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return res;
}
