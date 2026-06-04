const express = require('express');
const prisma = require('../db');
const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, table: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create order — sends real-time notification
router.post('/', async (req, res) => {
  try {
    const { tableId, type, source, items, tableRef } = req.body;
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const order = await prisma.order.create({
      data: {
        tableId: tableId ? parseInt(tableId) : null,
        type,
        source: source || 'Online',
        total,
        // store tableRef/customer name in a note field if schema has it
        items: {
          create: items.map(i => ({
            // menuItemId optional — offline items won't have it
            ...(i.menuItemId ? { menuItemId: parseInt(i.menuItemId) } : {}),
            quantity: parseInt(i.quantity),
            price: parseFloat(i.price),
            name: i.name || null   // ← store item name for offline orders
          }))
        }
      },
      include: { items: true }
    });

    // 🔔 Send real-time notification to dashboard
    const io = req.app.get('io');
    if (io) {
      io.emit('new_notification', {
        id: Date.now(),
        type: 'order',
        title: 'New Order Received!',
        message: `Order #${order.id} · ${source} · ₹${total}`,
        time: new Date().toLocaleTimeString(),
        color: '#3498DB'
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status — notifies when ready
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });

    // 🔔 Notify when order is ready
    if (status === 'Ready') {
      const io = req.app.get('io');
      if (io) {
        io.emit('new_notification', {
          id: Date.now(),
          type: 'ready',
          title: 'Order Ready!',
          message: `Order #${order.id} is ready to serve`,
          time: new Date().toLocaleTimeString(),
          color: '#2ECC71'
        });
      }
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;