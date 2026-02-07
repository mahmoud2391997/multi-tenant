import express from 'express';
import prisma from '../services/database';

const router = express.Router();

router.get('/', async (req, res) => {
  const { companyId } = req.query;
  try {
    const leads = await prisma.lead.findMany({
      where: companyId ? { company_id: companyId as string } : {}
    });
    res.json(leads);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { companyId, name, email, phone, status, source } = req.body;
  try {
    const lead = await prisma.lead.create({
      data: { company_id: companyId, name, email, phone, status, source }
    });
    res.json(lead);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
