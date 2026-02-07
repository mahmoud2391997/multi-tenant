import express from 'express';
import prisma from '../services/database';

const router = express.Router();

router.get('/', async (req, res) => {
  const { companyId } = req.query;
  try {
    const activeModules = await prisma.activeModule.findMany({
      where: companyId ? { company_id: companyId as string } : {}
    });
    res.json(activeModules);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { companyId, moduleName } = req.body;
  try {
    const activeModule = await prisma.activeModule.create({
      data: { company_id: companyId, module_name: moduleName }
    });
    res.json(activeModule);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/company/:companyId/module/:moduleName', async (req, res) => {
  const { companyId, moduleName } = req.params;
  try {
    await prisma.activeModule.delete({
      where: {
        company_id_module_name: {
          company_id: companyId,
          module_name: moduleName
        }
      }
    });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
