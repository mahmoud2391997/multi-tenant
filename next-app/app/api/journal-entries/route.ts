
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET journal entries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    
    const journalEntries = await prisma.journalEntry.findMany({
      where: companyId ? { company_id: companyId } : {},
      include: {
        company: true,
        transactions: true
      }
    });
    return NextResponse.json(journalEntries);
  } catch (error: any) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch journal entries' },
      { status: 500 }
    );
  }
}

// POST new journal entry
export async function POST(request: NextRequest) {
  try {
    const { companyId, date, description, transactions } = await request.json();
    
    if (!companyId || !date || !description || !transactions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const journalEntry = await prisma.journalEntry.create({
      data: {
        company_id: companyId,
        date: new Date(date),
        description,
        transactions: {
          create: transactions.map((t: any) => ({
            account_id: t.accountId,
            type: t.type,
            amount: t.amount
          }))
        }
      }
    });
    
    return NextResponse.json(journalEntry, { status: 201 });
  } catch (error: any) {
    console.error('Error creating journal entry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create journal entry' },
      { status: 500 }
    );
  }
}
