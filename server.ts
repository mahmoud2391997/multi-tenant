
import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`;
        res.json({ 
            status: 'ok', 
            message: 'Server is running',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        res.status(500).json({ 
            status: 'error', 
            message: 'Server is running but database connection failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// User Endpoints
app.get('/users', async (req, res) => {
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

app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
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
    res.json(user);
  });

app.post('/register', async (req, res) => {
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

      const createdCompany = await prisma.company.findUnique({
        where: { id: company.id },
        include: { active_modules: true }
      });

      return { user, company: { ...createdCompany, createdAt: createdCompany?.created_at } };
    });

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'A user with this email already exists.' });
      }
    }
    console.error('An unknown error occurred during registration:', error);
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt for email:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            memberships: {
                include: {
                    company: {
                        include: {
                            active_modules: true
                        }
                    },
                }
            }
        }
    });

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      console.log('Password mismatch for email:', email);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const { password_hash, ...userData } = user;
    console.log('Login successful for user:', user.id);
    res.json({ message: 'Login successful!', user: userData });

  } catch (error: any) {
    console.error('Error during login:', error);
    console.error('Error stack:', error.stack);
    const errorMessage = error.message || 'An error occurred during login.';
    res.status(500).json({ error: errorMessage });
  }
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.user.delete({
        where: { id },
    });
    res.status(204).send();
});


// Company Endpoints
app.get('/companies', async (req, res) => {
  const companies = await prisma.company.findMany({
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
      active_modules: true,
    },
  });
  // Transform to include activeModules in camelCase
  const transformedCompanies = companies.map(company => ({
    ...company,
    activeModules: company.active_modules.map(am => am.module_name),
  }));
  res.json(transformedCompanies);
});

app.get('/companies/:id', async (req, res) => {
  const { id } = req.params;
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
      active_modules: true,
    },
  });
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }
  // Transform to include activeModules in camelCase
  const transformedCompany = {
    ...company,
    activeModules: company.active_modules.map(am => am.module_name),
  };
  res.json(transformedCompany);
});

app.put('/companies/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const company = await prisma.company.update({
        where: { id },
        data: { name },
    });
    res.json(company);
});

app.delete('/companies/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.company.delete({
        where: { id },
    });
    res.status(204).send();
});


// Membership Endpoints
app.post('/memberships', async (req, res) => {
    const { userId, companyId, role } = req.body;
    const membership = await prisma.membership.create({
        data: {
            user_id: userId,
            company_id: companyId,
            role: role,
        },
    });
    res.json(membership);
});

app.delete('/memberships/user/:userId/company/:companyId', async (req, res) => {
    const { userId, companyId } = req.params;
    await prisma.membership.delete({
        where: {
            user_id_company_id: {
                user_id: userId,
                company_id: companyId,
            }
        },
    });
    res.status(204).send();
});

// ActiveModule Endpoints
app.post('/active-modules', async (req, res) => {
    try {
        const { companyId, moduleName } = req.body;
        
        if (!companyId || !moduleName) {
            return res.status(400).json({ error: 'companyId and moduleName are required' });
        }
        
        const activeModule = await prisma.activeModule.create({
            data: {
                company_id: companyId,
                module_name: moduleName,
            },
        });
        res.json(activeModule);
    } catch (error: any) {
        console.error('Error creating active module:', error);
        res.status(500).json({ error: 'Failed to create active module', details: error.message });
    }
});

app.delete('/active-modules/company/:companyId/module/:moduleName', async (req, res) => {
    try {
        const { companyId, moduleName } = req.params;
        
        if (!companyId || !moduleName) {
            return res.status(400).json({ error: 'companyId and moduleName are required' });
        }
        
        await prisma.activeModule.delete({
            where: {
                company_id_module_name: {
                    company_id: companyId,
                    module_name: moduleName,
                }
            },
        });
        res.status(204).send();
    } catch (error: any) {
        console.error('Error deleting active module:', error);
        res.status(500).json({ error: 'Failed to delete active module', details: error.message });
    }
});

// Invoice Endpoints
app.get('/invoices', async (req, res) => {
    const { companyId } = req.query;
    const where: Prisma.JournalEntryWhereInput = companyId ? { company_id: companyId as string } : {};
    
    // Get journal entries that represent invoices
    const invoices = await prisma.journalEntry.findMany({
        where: {
            ...where,
            reference: {
                startsWith: 'INV-'
            }
        },
        include: {
            lines: true,
        },
        orderBy: {
            date: 'desc'
        }
    });
    
    // Transform to invoice format
    const transformedInvoices = invoices.map(entry => ({
        id: entry.id,
        companyId: entry.company_id,
        date: entry.date instanceof Date ? entry.date.toISOString().split('T')[0] : entry.date,
        reference: entry.reference,
        description: entry.description,
        amount: entry.lines.reduce((sum, line) => sum + (line.debit || 0) - (line.credit || 0), 0),
        status: entry.lines.some(line => line.debit > 0) ? 'PAID' : 'SUCCESS',
        lines: entry.lines.map(line => ({
            id: line.id,
            accountId: line.account_id,
            description: line.description,
            amount: line.debit || line.credit || 0,
            type: line.debit > 0 ? 'DEBIT' : 'CREDIT'
        }))
    }));
    
    res.json(transformedInvoices);
});

app.get('/invoices/:id', async (req, res) => {
    const { id } = req.params;
    const invoice = await prisma.journalEntry.findUnique({
        where: { 
            id,
            reference: {
                startsWith: 'INV-'
            }
        },
        include: {
            lines: true,
        },
    });
    
    if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // Transform to invoice format
    const transformedInvoice = {
        id: invoice.id,
        companyId: invoice.company_id,
        date: invoice.date instanceof Date ? invoice.date.toISOString().split('T')[0] : invoice.date,
        reference: invoice.reference,
        description: invoice.description,
        amount: invoice.lines.reduce((sum, line) => sum + (line.debit || 0) - (line.credit || 0), 0),
        status: invoice.lines.some(line => line.debit > 0) ? 'PAID' : 'SUCCESS',
        lines: invoice.lines.map(line => ({
            id: line.id,
            accountId: line.account_id,
            description: line.description,
            amount: line.debit || line.credit || 0,
            type: line.debit > 0 ? 'DEBIT' : 'CREDIT'
        }))
    };
    
    res.json(transformedInvoice);
});

app.post('/invoices', async (req, res) => {
    try {
        const { companyId, customer, amount, description } = req.body;
        
        if (!companyId || !customer || !amount || amount <= 0) {
            return res.status(400).json({ error: 'companyId, customer, and positive amount are required' });
        }
        
        // Get accounts
        const arAccount = await prisma.account.findFirst({
            where: { 
                company_id: companyId,
                code: '1201'
            }
        });
        
        const salesAccount = await prisma.account.findFirst({
            where: { 
                company_id: companyId,
                code: '4101'
            }
        });
        
        if (!arAccount || !salesAccount) {
            return res.status(400).json({ error: 'Accounts receivable and sales accounts not found' });
        }
        
        const journalEntry = await prisma.journalEntry.create({
            data: {
                company_id: companyId,
                date: new Date(),
                reference: `INV-${Math.floor(Math.random() * 10000)}`,
                description: `فاتورة مبيعات عميل: ${customer}`,
                lines: {
                    create: [
                        {
                            account_id: arAccount.id,
                            description: `استحقاق عميل: ${customer}`,
                            debit: amount,
                            credit: 0
                        },
                        {
                            account_id: salesAccount.id,
                            description: `إثبات إيراد مبيعات: ${customer}`,
                            debit: 0,
                            credit: amount
                        }
                    ]
                }
            },
            include: { lines: true }
        });
        
        res.status(201).json({
            id: journalEntry.id,
            companyId: journalEntry.company_id,
            date: journalEntry.date.toISOString().split('T')[0],
            reference: journalEntry.reference,
            description: journalEntry.description,
            amount: amount,
            status: 'SUCCESS',
            lines: journalEntry.lines.map(line => ({
                id: line.id,
                accountId: line.account_id,
                description: line.description,
                amount: line.debit || line.credit || 0,
                type: line.debit > 0 ? 'DEBIT' : 'CREDIT'
            }))
        });
    } catch (error: any) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ error: 'Failed to create invoice', details: error.message });
    }
});

app.delete('/invoices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.journalEntry.delete({
            where: { 
                id,
                reference: {
                    startsWith: 'INV-'
                }
            }
        });
        res.status(204).send();
    } catch (error: any) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ error: 'Failed to delete invoice', details: error.message });
    }
});

// Account Endpoints
app.get('/accounts', async (req, res) => {
    const { companyId } = req.query;
    const where: Prisma.AccountWhereInput = companyId ? { company_id: companyId as string } : {};
    const accounts = await prisma.account.findMany({ where });
    res.json(accounts);
});

app.get('/accounts/:id', async (req, res) => {
    const { id } = req.params;
    const account = await prisma.account.findUnique({ where: { id } });
    res.json(account);
});

app.post('/accounts', async (req, res) => {
    try {
        console.log('POST /accounts - Request body:', req.body);
        const { companyId, code, name, type, balance } = req.body;
        
        if (!companyId) {
            return res.status(400).json({ error: 'companyId is required' });
        }
        
        const account = await prisma.account.create({
            data: {
                company_id: companyId,
                code: code,
                name: name,
                type: type,
                balance: balance || 0,
            },
        });
        console.log('Account created successfully:', account.id);
        res.json(account);
    } catch (error: any) {
        console.error('Error creating account:', error);
        res.status(500).json({ error: 'Failed to create account', details: error.message });
    }
});

app.put('/accounts/:id', async (req, res) => {
    const { id } = req.params;
    const { code, name, type, balance } = req.body;
    const account = await prisma.account.update({
        where: { id },
        data: { code, name, type, balance },
    });
    res.json(account);
});

app.delete('/accounts/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.account.delete({ where: { id } });
    res.status(204).send();
});

// JournalEntry Endpoints
app.get('/journal-entries', async (req, res) => {
    const { companyId } = req.query;
    console.log('GET /journal-entries - companyId:', companyId);
    const where: Prisma.JournalEntryWhereInput = companyId ? { company_id: companyId as string } : {};
    console.log('Query where clause:', where);
    const journalEntries = await prisma.journalEntry.findMany({
        where,
        include: {
            lines: true,
        }
    });
    console.log(`Found ${journalEntries.length} journal entries`);
    // Transform response to camelCase for frontend
    const transformedEntries = journalEntries.map(entry => ({
        id: entry.id,
        companyId: entry.company_id,
        date: entry.date instanceof Date ? entry.date.toISOString().split('T')[0] : entry.date,
        reference: entry.reference,
        description: entry.description,
        lines: entry.lines.map(line => ({
            id: line.id,
            accountId: line.account_id,
            description: line.description,
            debit: line.debit ? Number(line.debit) : 0,
            credit: line.credit ? Number(line.credit) : 0,
        })),
    }));
    console.log('Returning transformed entries:', transformedEntries.length);
    res.json(transformedEntries);
});

app.get('/journal-entries/:id', async (req, res) => {
    const { id } = req.params;
    const journalEntry = await prisma.journalEntry.findUnique({
        where: { id },
        include: {
            lines: true,
        }
    });
    if (!journalEntry) {
        return res.status(404).json({ error: 'Journal entry not found' });
    }
    // Transform response to camelCase for frontend
    const transformedEntry = {
        id: journalEntry.id,
        companyId: journalEntry.company_id,
        date: journalEntry.date instanceof Date ? journalEntry.date.toISOString().split('T')[0] : journalEntry.date,
        reference: journalEntry.reference,
        description: journalEntry.description,
        lines: journalEntry.lines.map(line => ({
            id: line.id,
            accountId: line.account_id,
            description: line.description,
            debit: line.debit ? Number(line.debit) : 0,
            credit: line.credit ? Number(line.credit) : 0,
        })),
    };
    res.json(transformedEntry);
});

app.post('/journal-entries', async (req, res) => {
    try {
        const { companyId, date, reference, description, lines } = req.body;
        
        if (!companyId || !lines || !Array.isArray(lines) || lines.length === 0) {
            return res.status(400).json({ error: 'companyId and lines are required' });
        }
        
        const transformedLines = lines.map((line: any) => ({
            account_id: line.accountId || line.account_id,
            description: line.description || null,
            debit: line.debit ? parseFloat(line.debit.toString()) : 0,
            credit: line.credit ? parseFloat(line.credit.toString()) : 0,
        }));
        
        const journalEntry = await prisma.journalEntry.create({
            data: {
                company_id: companyId,
                date: new Date(date),
                reference: reference || null,
                description: description || null,
                lines: { create: transformedLines },
            },
            include: { lines: true }
        });
        
        res.json({
            id: journalEntry.id,
            companyId: journalEntry.company_id,
            date: journalEntry.date.toISOString().split('T')[0],
            reference: journalEntry.reference,
            description: journalEntry.description,
            lines: journalEntry.lines.map(line => ({
                id: line.id,
                accountId: line.account_id,
                description: line.description,
                debit: Number(line.debit),
                credit: Number(line.credit),
            })),
        });
    } catch (error: any) {
        console.error('Error creating journal entry:', error);
        res.status(500).json({ error: 'Failed to create journal entry', details: error.message });
    }
});

app.put('/journal-entries/:id', async (req, res) => {
    const { id } = req.params;
    const { date, reference, description, lines } = req.body;
    
    try {
        console.log('PUT /journal-entries/:id - Request:', { id, date, reference, description, lines });
        
        await prisma.journalLine.deleteMany({ where: { entry_id: id } });
        
        const transformedLines = lines.map((line: any) => ({
            account_id: line.accountId || line.account_id,
            description: line.description || null,
            debit: line.debit ? parseFloat(line.debit.toString()) : 0,
            credit: line.credit ? parseFloat(line.credit.toString()) : 0,
        }));
        
        const journalEntry = await prisma.journalEntry.update({
            where: { id },
            data: {
                date: new Date(date),
                reference,
                description,
                lines: { create: transformedLines },
            },
            include: { lines: true }
        });
        
        res.json({
            id: journalEntry.id,
            companyId: journalEntry.company_id,
            date: journalEntry.date.toISOString().split('T')[0],
            reference: journalEntry.reference,
            description: journalEntry.description,
            lines: journalEntry.lines.map(line => ({
                id: line.id,
                accountId: line.account_id,
                description: line.description,
                debit: Number(line.debit),
                credit: Number(line.credit),
            })),
        });
    } catch (error: any) {
        console.error('Error updating journal entry:', error);
        res.status(500).json({ error: 'Failed to update', details: error.message });
    }
});

app.delete('/journal-entries/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.journalEntry.delete({ where: { id } });
    res.status(204).send();
});

// JournalLine Endpoints
app.post('/journal-lines', async (req, res) => {
    const { entryId, accountId, description, debit, credit } = req.body;
    const journalLine = await prisma.journalLine.create({
        data: {
            entry_id: entryId,
            account_id: accountId,
            description: description,
            debit: debit,
            credit: credit,
        },
    });
    res.json(journalLine);
});

app.put('/journal-lines/:id', async (req, res) => {
    const { id } = req.params;
    const { description, debit, credit } = req.body;
    const journalLine = await prisma.journalLine.update({
        where: { id },
        data: { description, debit, credit },
    });
    res.json(journalLine);
});

app.delete('/journal-lines/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.journalLine.delete({ where: { id } });
    res.status(204).send();
});

// Product Endpoints
app.get('/products', async (req, res) => {
    const { companyId } = req.query;
    const where: Prisma.ProductWhereInput = companyId ? { company_id: companyId as string } : {};
    const products = await prisma.product.findMany({ where });
    res.json(products);
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    res.json(product);
});

app.post('/products', async (req, res) => {
    try {
        console.log('POST /products - Request body:', req.body);
        const { companyId, name, sku, price, stock, category } = req.body;
        
        if (!companyId) {
            return res.status(400).json({ error: 'companyId is required' });
        }
        
        const product = await prisma.product.create({
            data: {
                company_id: companyId,
                name,
                sku,
                price,
                stock: stock || 0,
                category,
            },
        });
        console.log('Product created successfully:', product.id);
        res.json(product);
    } catch (error: any) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product', details: error.message });
    }
});

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, sku, price, stock, category } = req.body;
    const product = await prisma.product.update({
        where: { id },
        data: { name, sku, price, stock, category },
    });
    res.json(product);
});

app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('DELETE /products - Deleting product with id:', id);
        
        // First check if the product exists
        const existingProduct = await prisma.product.findUnique({ where: { id } });
        if (!existingProduct) {
            console.log('Product not found:', id);
            return res.status(404).json({ error: 'Product not found' });
        }
        
        console.log('Found product to delete:', existingProduct);
        
        // Delete the product
        await prisma.product.delete({ where: { id } });
        console.log('Product deleted successfully:', id);
        
        res.status(204).send();
    } catch (error: any) {
        console.error('Error deleting product:', error);
        
        // Check for foreign key constraint errors
        if (error.code === 'P2003') {
            res.status(400).json({ 
                error: 'Cannot delete product - it may be referenced by other records',
                details: 'This product might be used in transactions or other records'
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to delete product', 
                details: error.message 
            });
        }
    }
});


// Warehouse Endpoints
app.get('/warehouses', async (req, res) => {
    const { companyId } = req.query;
    const where: Prisma.WarehouseWhereInput = companyId ? { company_id: companyId as string } : {};
    const warehouses = await prisma.warehouse.findMany({ where });
    res.json(warehouses);
});

app.get('/warehouses/:id', async (req, res) => {
    const { id } = req.params;
    const warehouse = await prisma.warehouse.findUnique({ where: { id } });
    res.json(warehouse);
});

app.post('/warehouses', async (req, res) => {
    try {
        console.log('POST /warehouses - Request body:', req.body);
        const { companyId, name, location, capacity } = req.body;
        
        if (!companyId) {
            return res.status(400).json({ error: 'companyId is required' });
        }
        
        const warehouse = await prisma.warehouse.create({
            data: {
                company_id: companyId,
                name,
                location,
                capacity,
            },
        });
        console.log('Warehouse created successfully:', warehouse.id);
        res.json(warehouse);
    } catch (error: any) {
        console.error('Error creating warehouse:', error);
        res.status(500).json({ error: 'Failed to create warehouse', details: error.message });
    }
});

app.put('/warehouses/:id', async (req, res) => {
    const { id } = req.params;
    const { name, location, capacity } = req.body;
    const warehouse = await prisma.warehouse.update({
        where: { id },
        data: { name, location, capacity },
    });
    res.json(warehouse);
});

app.delete('/warehouses/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.warehouse.delete({ where: { id } });
    res.status(204).send();
});

// Employee Endpoints
app.get('/employees', async (req, res) => {
    const { companyId } = req.query;
    const where: Prisma.EmployeeWhereInput = companyId ? { company_id: companyId as string } : {};
    const employees = await prisma.employee.findMany({ where });
    res.json(employees);
});

app.get('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({ where: { id } });
    res.json(employee);
});

app.post('/employees', async (req, res) => {
    try {
        console.log('POST /employees - Request body:', req.body);
        const { companyId, name, role, department, salary, status } = req.body;
        
        if (!companyId) {
            return res.status(400).json({ error: 'companyId is required' });
        }
        
        const employee = await prisma.employee.create({
            data: {
                company_id: companyId,
                name,
                role,
                department,
                salary,
                status: status || 'ACTIVE',
            },
        });
        console.log('Employee created successfully:', employee.id);
        res.json(employee);
    } catch (error: any) {
        console.error('Error creating employee:', error);
        res.status(500).json({ error: 'Failed to create employee', details: error.message });
    }
});

app.put('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { name, role, department, salary, status } = req.body;
    const employee = await prisma.employee.update({
        where: { id },
        data: { name, role, department, salary, status },
    });
    res.json(employee);
});

app.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.employee.delete({ where: { id } });
    res.status(204).send();
});


// PayrollRecord Endpoints
app.get('/payroll-records', async (req, res) => {
    const { companyId } = req.query;
    const where: Prisma.PayrollRecordWhereInput = companyId ? { company_id: companyId as string } : {};
    const payrollRecords = await prisma.payrollRecord.findMany({ where });
    res.json(payrollRecords);
});

app.get('/payroll-records/:id', async (req, res) => {
    const { id } = req.params;
    const payrollRecord = await prisma.payrollRecord.findUnique({ where: { id } });
    res.json(payrollRecord);
});

app.post('/payroll-records', async (req, res) => {
    try {
        console.log('POST /payroll-records - Request body:', req.body);
        const { companyId, employeeId, month, amount, status, paymentDate } = req.body;
        
        if (!companyId) {
            return res.status(400).json({ error: 'companyId is required' });
        }
        
        if (!employeeId) {
            return res.status(400).json({ error: 'employeeId is required' });
        }
        
        const payrollRecord = await prisma.payrollRecord.create({
            data: {
                company_id: companyId,
                employee_id: employeeId,
                month,
                amount,
                status: status || 'PENDING',
                payment_date: paymentDate ? new Date(paymentDate) : null,
            },
        });
        console.log('Payroll record created successfully:', payrollRecord.id);
        res.json(payrollRecord);
    } catch (error: any) {
        console.error('Error creating payroll record:', error);
        res.status(500).json({ error: 'Failed to create payroll record', details: error.message });
    }
});

app.put('/payroll-records/:id', async (req, res) => {
    const { id } = req.params;
    const { month, amount, status, paymentDate } = req.body;
    const payrollRecord = await prisma.payrollRecord.update({
        where: { id },
        data: { month, amount, status, payment_date: paymentDate },
    });
    res.json(payrollRecord);
});

app.delete('/payroll-records/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.payrollRecord.delete({ where: { id } });
    res.status(204).send();
});


// Lead Endpoints
app.get('/leads', async (req, res) => {
    const { companyId } = req.query;
    const where: Prisma.LeadWhereInput = companyId ? { company_id: companyId as string } : {};
    const leads = await prisma.lead.findMany({ where });
    res.json(leads);
});

app.get('/leads/:id', async (req, res) => {
    const { id } = req.params;
    const lead = await prisma.lead.findUnique({ where: { id } });
    res.json(lead);
});

app.post('/leads', async (req, res) => {
    try {
        console.log('POST /leads - Request body:', req.body);
        const { companyId, name, companyName, value, stage, chance } = req.body;
        
        if (!companyId) {
            return res.status(400).json({ error: 'companyId is required' });
        }
        
        const lead = await prisma.lead.create({
            data: {
                company_id: companyId,
                name,
                company_name: companyName,
                value,
                stage: stage || 'NEW',
                chance: chance || 0,
            },
        });
        console.log('Lead created successfully:', lead.id);
        res.json(lead);
    } catch (error: any) {
        console.error('Error creating lead:', error);
        res.status(500).json({ error: 'Failed to create lead', details: error.message });
    }
});

app.put('/leads/:id', async (req, res) => {
    const { id } = req.params;
    const { name, companyName, value, stage, chance } = req.body;
    const lead = await prisma.lead.update({
        where: { id },
        data: { name, company_name: companyName, value, stage, chance },
    });
    res.json(lead);
});

app.delete('/leads/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.lead.delete({ where: { id } });
    res.status(204).send();
});


const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
