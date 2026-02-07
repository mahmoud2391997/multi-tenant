
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET invoices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    
    const invoices = await prisma.invoice.findMany({
      where: companyId ? { company_id: companyId } : {},
      include: {
        company: true,
        items: true
      }
    });
    return NextResponse.json(invoices);
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST new invoice
export async function POST(request: NextRequest) {
  try {
    const { companyId, items, total, status } = await request.json();
    
    if (!companyId || !items || !total || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const invoice = await prisma.invoice.create({
      data: {
        company_id: companyId,
        total: parseFloat(total),
        status,
        items: {
          create: items.map((item: any) => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });
    
    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
