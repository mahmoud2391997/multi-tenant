import express from 'express';
import prisma from '../services/database';

const router = express.Router();

router.get('/', async (req, res) => {
  const { companyId } = req.query;
  try {
    const warehouses = await prisma.warehouse.findMany({
      where: companyId ? { company_id: companyId as string } : {}
    });
    res.json(warehouses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { companyId, name, location, capacity } = req.body;
  try {
    const warehouse = await prisma.warehouse.create({
      data: { company_id: companyId, name, location, capacity: parseInt(capacity) }
    });
    res.json(warehouse);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
