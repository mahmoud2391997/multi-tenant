import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import userRoutes from './routes/users';
import companyRoutes from './routes/companies';
import accountRoutes from './routes/accounts';
import journalEntryRoutes from './routes/journal-entries';
import productRoutes from './routes/products';
import warehouseRoutes from './routes/warehouses';
import employeeRoutes from './routes/employees';
import payrollRoutes from './routes/payroll-records';
import leadRoutes from './routes/leads';
import activeModuleRoutes from './routes/active-modules';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
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

// Routes
app.use('/users', userRoutes);
app.use('/companies', companyRoutes);
app.use('/accounts', accountRoutes);
app.use('/journal-entries', journalEntryRoutes);
app.use('/products', productRoutes);
app.use('/warehouses', warehouseRoutes);
app.use('/employees', employeeRoutes);
app.use('/payroll-records', payrollRoutes);
app.use('/leads', leadRoutes);
app.use('/active-modules', activeModuleRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Zenith Server is running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

export default app;
