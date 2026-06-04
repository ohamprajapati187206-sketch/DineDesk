const express = require('express');
const prisma = require('../db');
const router = express.Router();

router.get('/summary', async (req, res) => {
  try {
    const { branchId } = req.query;
    const branchFilter = branchId ? { branchId: parseInt(branchId) } : {};
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const week = new Date(today); week.setDate(week.getDate() - 6);

    const [totalOrders, todayOrders, weekOrders, rooms, staff, inventory] = await Promise.all([
      prisma.order.count({ where: branchFilter }),
      prisma.order.findMany({ where: { ...branchFilter, createdAt: { gte: today } } }),
      prisma.order.findMany({ where: { ...branchFilter, createdAt: { gte: week } } }),
      prisma.room.findMany({ where: branchFilter }),
      prisma.staff.count({ where: branchFilter }),
      prisma.inventoryItem.findMany({ where: branchFilter })
    ]);

    const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
    const lowStock = inventory.filter(i => i.currentStock <= i.minStock).length;

    // Build last 7 days revenue array
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    const weeklyRevenue = days.map(d => {
      const next = new Date(d); next.setDate(d.getDate() + 1);
      const dayOrders = weekOrders.filter(o => new Date(o.createdAt) >= d && new Date(o.createdAt) < next);
      return {
        day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        revenue: dayOrders.reduce((s, o) => s + o.total, 0),
        orders: dayOrders.length
      };
    });

    // Order type breakdown
    const typeBreakdown = ['Dine-in', 'Takeaway', 'Delivery'].map(type => ({
      type,
      count: weekOrders.filter(o => o.type === type).length
    }));

    // Source breakdown
    const sourceBreakdown = ['Online', 'Offline'].map(source => ({
      source,
      count: weekOrders.filter(o => o.source === source).length
    }));

    // Room status breakdown
    const roomStatus = [
      { label: 'Available', count: rooms.filter(r => r.status === 'Available').length },
      { label: 'Occupied', count: rooms.filter(r => r.status === 'Occupied').length },
      { label: 'Maintenance', count: rooms.filter(r => r.status === 'Maintenance').length },
    ];

    res.json({
      todayRevenue, todayOrders: todayOrders.length,
      totalOrders, occupiedRooms, totalRooms: rooms.length,
      totalStaff: staff, lowStockItems: lowStock,
      weeklyRevenue, typeBreakdown, sourceBreakdown, roomStatus
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

module.exports = router;