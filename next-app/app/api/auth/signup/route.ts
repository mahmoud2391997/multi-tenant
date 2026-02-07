
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        name,
      },
    });

    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
