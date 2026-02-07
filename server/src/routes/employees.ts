import express from 'express';
import prisma from '../services/database';

const router = express.Router();

router.get('/', async (req, res) => {
  const { companyId } = req.query;
  try {
    const employees = await prisma.employee.findMany({
      where: companyId ? { company_id: companyId as string } : {}
    });
    res.json(employees);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { companyId, name, email, position, salary, status } = req.body;
  try {
    const employee = await prisma.employee.create({
      data: { company_id: companyId, name, email, position, salary: parseFloat(salary), status }
    });
    res.json(employee);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
