const express = require('express');
const prisma = require('../db');
const router = express.Router();

// Get all tables — filtered by branch
router.get('/', async (req, res) => {
  try {
    const { branchId } = req.query;
    const where = branchId ? { branchId: parseInt(branchId) } : {};
    const tables = await prisma.diningTable.findMany({ where });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

// Add table — attach branchId
router.post('/', async (req, res) => {
  try {
    const { name, capacity, branchId } = req.body;
    const table = await prisma.diningTable.create({
      data: {
        name,
        capacity: parseInt(capacity),
        branchId: parseInt(branchId) || 1
      }
    });
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create table' });
  }
});

// Update table status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const table = await prisma.diningTable.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update table' });
  }
});

module.exports = router;