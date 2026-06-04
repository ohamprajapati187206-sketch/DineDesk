const express = require('express');
const prisma = require('../db');
const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Add menu item
router.post('/', async (req, res) => {
  try {
    const { name, category, price, isVeg, photo } = req.body;
    const item = await prisma.menuItem.create({
      data: { name, category, price: parseFloat(price), isVeg, photo }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update menu item
router.put('/:id', async (req, res) => {
  try {
    const { name, category, price, isVeg, isActive, photo } = req.body;
    const item = await prisma.menuItem.update({
      where: { id: parseInt(req.params.id) },
      data: { name, category, price: parseFloat(price), isVeg, isActive, photo }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete menu item
router.delete('/:id', async (req, res) => {
  try {
    await prisma.menuItem.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;