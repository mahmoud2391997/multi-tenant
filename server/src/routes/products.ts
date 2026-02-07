import express from 'express';
import prisma from '../services/database';

const router = express.Router();

// Get products
router.get('/', async (req, res) => {
  const { companyId } = req.query;
  try {
    const products = await prisma.product.findMany({
      where: companyId ? { company_id: companyId as string } : {},
      include: {
        company: true
      }
    });
    res.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch products' });
  }
});

// Create product
router.post('/', async (req, res) => {
  const { companyId, name, sku, price, stock, category } = req.body;
  
  if (!companyId || !name || !sku || !price || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const product = await prisma.product.create({
      data: {
        company_id: companyId,
        name,
        sku,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        category
      }
    });
    res.json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message || 'Failed to create product' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, sku, price, stock, category } = req.body;
  
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        sku,
        price: price ? parseFloat(price) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        category
      }
    });
    res.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: error.message || 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
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

export default router;
