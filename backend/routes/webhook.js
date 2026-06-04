const express = require('express');
const prisma = require('../db');
const router = express.Router();

// ── Webhook secret (add to .env later for real integration)
const SWIGGY_SECRET = process.env.SWIGGY_WEBHOOK_SECRET || 'swiggy_test_secret';
const ZOMATO_SECRET = process.env.ZOMATO_WEBHOOK_SECRET || 'zomato_test_secret';

// ── Normalize Swiggy payload → DineDesk format
const normalizeSwiggy = (body) => ({
  source: 'Swiggy',
  type: 'Delivery',
  externalId: body.order_id || body.id,
  customerName: body.customer?.name || 'Swiggy Customer',
  customerPhone: body.customer?.phone || '',
  items: (body.order_items || body.items || []).map(i => ({
    name: i.name || i.item_name,
    quantity: parseInt(i.quantity || i.qty) || 1,
    price: parseFloat(i.price || i.unit_price) || 0
  })),
  total: parseFloat(body.order_total || body.total) || 0,
  address: body.delivery_address?.address || ''
});

// ── Normalize Zomato payload → DineDesk format
const normalizeZomato = (body) => ({
  source: 'Zomato',
  type: 'Delivery',
  externalId: body.resOrderId || body.order_id,
  customerName: body.customerName || body.customer_name || 'Zomato Customer',
  customerPhone: body.customerPhone || '',
  items: (body.itemDetails || body.items || []).map(i => ({
    name: i.itemName || i.name,
    quantity: parseInt(i.quantity || i.qty) || 1,
    price: parseFloat(i.itemPrice || i.price) || 0
  })),
  total: parseFloat(body.orderTotal || body.total) || 0,
  address: body.deliveryAddress || ''
});

// ── Shared order creator
const createExternalOrder = async (req, normalized) => {
  const { source, type, externalId, customerName, customerPhone, items, total, address } = normalized;

  // Recalculate total from items if not provided
  const calcTotal = total || items.reduce((s, i) => s + i.price * i.quantity, 0);

  const order = await prisma.order.create({
    data: {
      type,
      source,
      total: calcTotal,
      status: 'New',
      items: {
        create: items.map(i => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price
        }))
      }
    },
    include: { items: true }
  });

  // 🔔 Real-time notification
  const io = req.app.get('io');
  if (io) {
    io.emit('new_notification', {
      id: Date.now(),
      type: 'order',
      title: `New ${source} Order!`,
      message: `Order #${order.id} · ${customerName} · ₹${calcTotal.toFixed(2)}`,
      time: new Date().toLocaleTimeString(),
      color: source === 'Swiggy' ? '#FC8019' : '#E23744'
    });
  }

  return order;
};

// ── Swiggy webhook endpoint
router.post('/swiggy', async (req, res) => {
  try {
    // Verify secret (real Swiggy sends X-Swiggy-Signature header)
    const sig = req.headers['x-swiggy-signature'];
    if (sig && sig !== SWIGGY_SECRET) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const normalized = normalizeSwiggy(req.body);
    const order = await createExternalOrder(req, normalized);
    res.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error('Swiggy webhook error:', err);
    res.status(500).json({ error: 'Failed to process Swiggy order' });
  }
});

// ── Zomato webhook endpoint
router.post('/zomato', async (req, res) => {
  try {
    const sig = req.headers['x-zomato-signature'];
    if (sig && sig !== ZOMATO_SECRET) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const normalized = normalizeZomato(req.body);
    const order = await createExternalOrder(req, normalized);
    res.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error('Zomato webhook error:', err);
    res.status(500).json({ error: 'Failed to process Zomato order' });
  }
});

// ── Mock test endpoint (remove in production)
router.post('/test/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    let normalized;

    if (platform === 'swiggy') {
      normalized = normalizeSwiggy({
        order_id: `SWG-${Date.now()}`,
        customer: { name: 'Test Swiggy User', phone: '9999999999' },
        order_items: [
          { name: 'Paneer Butter Masala', quantity: 1, price: 280 },
          { name: 'Butter Naan', quantity: 2, price: 40 }
        ],
        order_total: 360,
        delivery_address: { address: '123 Test Street, Surat' }
      });
    } else if (platform === 'zomato') {
      normalized = normalizeZomato({
        resOrderId: `ZOM-${Date.now()}`,
        customerName: 'Test Zomato User',
        customerPhone: '8888888888',
        itemDetails: [
          { itemName: 'Dal Makhani', quantity: 1, itemPrice: 220 },
          { itemName: 'Jeera Rice', quantity: 1, itemPrice: 150 }
        ],
        orderTotal: 370,
        deliveryAddress: '456 Mock Lane, Surat'
      });
    } else {
      return res.status(400).json({ error: 'Unknown platform. Use swiggy or zomato' });
    }

    const order = await createExternalOrder(req, normalized);
    res.json({ success: true, orderId: order.id, normalized });
  } catch (err) {
    console.error('Test webhook error:', err);
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;