
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET employees
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    
    const employees = await prisma.employee.findMany({
      where: companyId ? { company_id: companyId } : {},
      include: {
        company: true
      }
    });
    return NextResponse.json(employees);
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST new employee
export async function POST(request: NextRequest) {
  try {
    const { companyId, name, email, position, salary } = await request.json();
    
    if (!companyId || !name || !email || !position || !salary) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const employee = await prisma.employee.create({
      data: {
        company_id: companyId,
        name,
        email,
        position,
        salary: parseFloat(salary)
      }
    });
    
    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create employee' },
      { status: 500 }
    );
  }
}
