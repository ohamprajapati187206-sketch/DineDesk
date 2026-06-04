const express = require('express');
const prisma = require('../db');
const router = express.Router();

// Get all rooms — filtered by branch
router.get('/', async (req, res) => {
  try {
    const { branchId } = req.query;
    const where = branchId ? { branchId: parseInt(branchId) } : {};
    const rooms = await prisma.room.findMany({ where });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Add room — attach branchId
router.post('/', async (req, res) => {
  try {
    const { number, type, price, branchId } = req.body;
    const room = await prisma.room.create({
      data: {
        number, type,
        price: parseFloat(price),
        branchId: parseInt(branchId) || 1
      }
    });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Update room status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const room = await prisma.room.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update room' });
  }
});

module.exports = router;