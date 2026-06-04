const express = require('express');
const prisma = require('../db');
const router = express.Router();

// Get all branches
router.get('/', async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        _count: { select: { orders: true, staff: true, rooms: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(branches);
  } catch { res.status(500).json({ error: 'Failed' }); }
});

// Create branch
router.post('/', async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const branch = await prisma.branch.create({ data: { name, address, phone } });
    res.json(branch);
  } catch { res.status(500).json({ error: 'Failed' }); }
});

// Update branch
router.patch('/:id', async (req, res) => {
  try {
    const branch = await prisma.branch.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(branch);
  } catch { res.status(500).json({ error: 'Failed' }); }
});

// Delete branch
router.delete('/:id', async (req, res) => {
  try {
    await prisma.branch.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed' }); }
});

// Branch summary (for superadmin dashboard)
router.get('/:id/summary', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const today = new Date(); today.setHours(0,0,0,0);
    const [orders, todayOrders, rooms, staff] = await Promise.all([
      prisma.order.count({ where: { branchId: id } }),
      prisma.order.findMany({ where: { branchId: id, createdAt: { gte: today } } }),
      prisma.room.findMany({ where: { branchId: id } }),
      prisma.staff.count({ where: { branchId: id } })
    ]);
    res.json({
      totalOrders: orders,
      todayRevenue: todayOrders.reduce((s, o) => s + o.total, 0),
      todayOrders: todayOrders.length,
      occupiedRooms: rooms.filter(r => r.status === 'Occupied').length,
      totalRooms: rooms.length,
      totalStaff: staff
    });
  } catch { res.status(500).json({ error: 'Failed' }); }
});

module.exports = router;