import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET companies
export async function GET(request: NextRequest) {
  try {
    const companies = await prisma.company.findMany({
      include: {
        active_modules: true,
        memberships: {
          include: {
            user: true
          }
        }
      }
    });
    return NextResponse.json(companies);
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}
