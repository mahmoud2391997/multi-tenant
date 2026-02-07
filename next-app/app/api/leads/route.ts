
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET leads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    
    const leads = await prisma.lead.findMany({
      where: companyId ? { company_id: companyId } : {},
      include: {
        company: true
      }
    });
    return NextResponse.json(leads);
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST new lead
export async function POST(request: NextRequest) {
  try {
    const { companyId, name, email, phone, status } = await request.json();
    
    if (!companyId || !name || !email || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const lead = await prisma.lead.create({
      data: {
        company_id: companyId,
        name,
        email,
        phone,
        status
      }
    });
    
    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create lead' },
      { status: 500 }
    );
  }
}
