import express from 'express';
import prisma from '../services/database';

const router = express.Router();

// Get journal entries
router.get('/', async (req, res) => {
  const { companyId } = req.query;
  try {
    const entries = await prisma.journalEntry.findMany({
      where: companyId ? { company_id: companyId as string } : {},
      include: {
        company: true
      },
      orderBy: { date: 'desc' }
    });
    res.json(entries);
  } catch (error: any) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch journal entries' });
  }
});

// Create journal entry
router.post('/', async (req, res) => {
  const { companyId, date, reference, description, debitAccountId, creditAccountId, amount } = req.body;
  
  if (!companyId || !date || !debitAccountId || !creditAccountId || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const entry = await prisma.journalEntry.create({
      data: {
        company_id: companyId,
        date: new Date(date),
        reference,
        description,
        debit_account_id: debitAccountId,
        credit_account_id: creditAccountId,
        amount: parseFloat(amount)
      }
    });
    res.json(entry);
  } catch (error: any) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ error: error.message || 'Failed to create journal entry' });
  }
});

export default router;
