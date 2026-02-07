import express from 'express';
import prisma from '../services/database';

const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        active_modules: true,
        memberships: {
          include: {
            user: true
          }
        }
      }
    });
    res.json(companies);
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch companies' });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        active_modules: true,
        memberships: {
          include: {
            user: true
          }
        }
      }
    });
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(company);
  } catch (error: any) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch company' });
  }
});

export default router;
