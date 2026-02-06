
import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// User Endpoints
app.get('/users', async (req, res) => {
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
});

app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            company: true,
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
        data: {
          name,
          email,
          password_hash: passwordHash,
        },
      });

      const company = await prisma.company.create({
        data: {
          name: companyName,
          admin_email: email,
        },
      });

      await prisma.membership.create({
        data: {
          user_id: user.id,
          company_id: company.id,
          role: 'ADMIN',
        },
      });

      return { user, company };
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

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            memberships: {
                include: {
                    company: true,
                }
            }
        }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const { password_hash, ...userData } = user;
    res.json({ message: 'Login successful!', user: userData });

  } catch (error) {
    console.error('An unknown error occurred during login:', error);
    res.status(500).json({ error: 'An error occurred during login.' });
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
      accounts: true,
      journal_entries: true,
      products: true,
      warehouses: true,
      employees: true,
      payroll_records: true,
      leads: true
    },
  });
  res.json(companies);
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
          accounts: true,
          journal_entries: { include: { lines: true } },
          products: true,
          warehouses: true,
          employees: true,
          payroll_records: true,
          leads: true
    },
  });
  res.json(company);
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
    const { companyId, moduleName } = req.body;
    const activeModule = await prisma.activeModule.create({
        data: {
            company_id: companyId,
            module_name: moduleName,
        },
    });
    res.json(activeModule);
});

app.delete('/active-modules/company/:companyId/module/:moduleName', async (req, res) => {
    const { companyId, moduleName } = req.params;
    await prisma.activeModule.delete({
        where: {
            company_id_module_name: {
                company_id: companyId,
                module_name: moduleName,
            }
        },
    });
    res.status(204).send();
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
    const { companyId, code, name, type, balance } = req.body;
    const account = await prisma.account.create({
        data: {
            company_id: companyId,
            code: code,
            name: name,
            type: type,
            balance: balance,
        },
    });
    res.json(account);
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
    const where: Prisma.JournalEntryWhereInput = companyId ? { company_id: companyId as string } : {};
    const journalEntries = await prisma.journalEntry.findMany({
        where,
        include: {
            lines: true,
        }
    });
    res.json(journalEntries);
});

app.get('/journal-entries/:id', async (req, res) => {
    const { id } = req.params;
    const journalEntry = await prisma.journalEntry.findUnique({
        where: { id },
        include: {
            lines: true,
        }
    });
    res.json(journalEntry);
});

app.post('/journal-entries', async (req, res) => {
    const { companyId, date, reference, description, lines } = req.body;
    const journalEntry = await prisma.journalEntry.create({
        data: {
            company_id: companyId,
            date: date,
            reference: reference,
            description: description,
            lines: {
                create: lines,
            },
        },
        include: { lines: true }
    });
    res.json(journalEntry);
});

app.put('/journal-entries/:id', async (req, res) => {
    const { id } = req.params;
    const { date, reference, description } = req.body;
    const journalEntry = await prisma.journalEntry.update({
        where: { id },
        data: { date, reference, description },
    });
    res.json(journalEntry);
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
    const { companyId, name, sku, price, stock, category } = req.body;
    const product = await prisma.product.create({
        data: {
            company_id: companyId,
            name,
            sku,
            price,
            stock,
            category,
        },
    });
    res.json(product);
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
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
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
    const { companyId, name, location, capacity } = req.body;
    const warehouse = await prisma.warehouse.create({
        data: {
            company_id: companyId,
            name,
            location,
            capacity,
        },
    });
    res.json(warehouse);
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
    const { companyId, name, role, department, salary, status } = req.body;
    const employee = await prisma.employee.create({
        data: {
            company_id: companyId,
            name,
            role,
            department,
            salary,
            status,
        },
    });
    res.json(employee);
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
    const { companyId, employeeId, month, amount, status, paymentDate } = req.body;
    const payrollRecord = await prisma.payrollRecord.create({
        data: {
            company_id: companyId,
            employee_id: employeeId,
            month,
            amount,
            status,
            payment_date: paymentDate,
        },
    });
    res.json(payrollRecord);
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
    const { companyId, name, companyName, value, stage, chance } = req.body;
    const lead = await prisma.lead.create({
        data: {
            company_id: companyId,
            name,
            company_name: companyName,
            value,
            stage,
            chance,
        },
    });
    res.json(lead);
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


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
