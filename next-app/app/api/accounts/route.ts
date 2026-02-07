
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AccountType } from '../../../types';

const prisma = new PrismaClient();

// GET accounts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    
    const accounts = await prisma.account.findMany({
      where: companyId ? { company_id: companyId } : {},
      include: {
        company: true
      }
    });
    return NextResponse.json(accounts);
  } catch (error: any) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

// POST new account
export async function POST(request: NextRequest) {
  try {
    const { companyId, name, code, type, balance } = await request.json();
    
    if (!companyId || !name || !code || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const account = await prisma.account.create({
      data: {
        company_id: companyId,
        name,
        code,
        type: type as AccountType,
        balance: parseFloat(balance) || 0
      }
    });
    
    return NextResponse.json(account, { status: 201 });
  } catch (error: any) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}
