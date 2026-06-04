const express = require('express');
const prisma = require('../db');
const router = express.Router();

// Get all inventory — filtered by branch
router.get('/', async (req, res) => {
  try {
    const { branchId } = req.query;
    const where = branchId ? { branchId: parseInt(branchId) } : {};
    const items = await prisma.inventoryItem.findMany({ where });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Add inventory item — attach branchId
router.post('/', async (req, res) => {
  try {
    const { name, unit, currentStock, minStock, supplier, branchId } = req.body;
    const item = await prisma.inventoryItem.create({
      data: {
        name, unit,
        currentStock: parseFloat(currentStock),
        minStock: parseFloat(minStock),
        supplier,
        branchId: parseInt(branchId) || 1
      }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update stock
router.patch('/:id', async (req, res) => {
  try {
    const { currentStock } = req.body;
    const item = await prisma.inventoryItem.update({
      where: { id: parseInt(req.params.id) },
      data: { currentStock: parseFloat(currentStock) }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

module.exports = router;