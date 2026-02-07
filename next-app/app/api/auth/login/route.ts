
import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60,
      path: '/',
    });

    return NextResponse.json({ message: 'Logged in successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
