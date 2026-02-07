import express from 'express';
import prisma from '../services/database';

const router = express.Router();

router.get('/', async (req, res) => {
  const { companyId } = req.query;
  try {
    const payrollRecords = await prisma.payrollRecord.findMany({
      where: companyId ? { company_id: companyId as string } : {}
    });
    res.json(payrollRecords);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { companyId, employeeId, month, amount, status, paymentDate } = req.body;
  try {
    const payrollRecord = await prisma.payrollRecord.create({
      data: {
        company_id: companyId,
        employee_id: employeeId,
        month,
        amount: parseFloat(amount),
        status,
        payment_date: paymentDate ? new Date(paymentDate) : null,
      },
    });
    res.json(payrollRecord);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
