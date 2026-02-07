import express from 'express';
import prisma from '../services/database';

const router = express.Router();

// Get accounts
router.get('/', async (req, res) => {
  const { companyId } = req.query;
  try {
    const accounts = await prisma.account.findMany({
      where: companyId ? { company_id: companyId as string } : {},
      include: {
        company: true
      }
    });
    res.json(accounts);
  } catch (error: any) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch accounts' });
  }
});

// Create account
router.post('/', async (req, res) => {
  const { companyId, code, name, type, balance = 0 } = req.body;
  
  if (!companyId || !code || !name || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const account = await prisma.account.create({
      data: {
        company_id: companyId,
        code,
        name,
        type,
        balance
      }
    });
    res.json(account);
  } catch (error: any) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: error.message || 'Failed to create account' });
  }
});

export default router;
