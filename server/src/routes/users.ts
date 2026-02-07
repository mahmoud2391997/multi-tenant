import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import prisma from '../services/database';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        memberships: {
          include: {
            company: true,
          },
        },
      },
    });
    res.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            company: {
              include: {
                active_modules: true
              }
            },
          },
        },
      },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch user' });
  }
});

// Register new user and company
router.post('/register', async (req, res) => {
  const { name, email, password, companyName } = req.body;

  if (!name || !email || !password || !companyName) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: { name, email, password_hash: passwordHash },
      });

      const company = await prisma.company.create({
        data: { name: companyName, admin_email: email },
      });

      await prisma.membership.create({
        data: { user_id: user.id, company_id: company.id, role: 'ADMIN' },
      });

      await prisma.activeModule.create({
        data: { company_id: company.id, module_name: 'ACCOUNTING' },
      });

      const accounts = [
        { code: '1101', name: 'الصندوق', type: 'ASSET' },
        { code: '1102', name: 'البنك', type: 'ASSET' },
        { code: '1201', name: 'حسابات المدينين', type: 'ASSET' },
        { code: '2101', name: 'حسابات الدائنين', type: 'LIABILITY' },
        { code: '3101', name: 'رأس المال', type: 'EQUITY' },
        { code: '4101', name: 'إيراد المبيعات', type: 'REVENUE' },
        { code: '5101', name: 'مصاريف تشغيلية', type: 'EXPENSE' },
      ];

      for (const acc of accounts) {
        await prisma.account.create({
          data: { company_id: company.id, ...acc, balance: 0 },
        });
      }

      return { user, company };
    });

    console.log('✅ Backend connected - Users fetched:', 1);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

export default router;
