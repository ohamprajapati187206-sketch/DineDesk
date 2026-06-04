const express = require('express');
const prisma = require('../db');
const router = express.Router();

// Get all bookings — filtered by branch
router.get('/', async (req, res) => {
  try {
    const { branchId } = req.query;
    const where = branchId ? { branchId: parseInt(branchId) } : {};
    const bookings = await prisma.booking.findMany({
      where,
      include: { room: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Create booking — attach branchId + real-time notification
router.post('/', async (req, res) => {
  try {
    const { guestName, guestPhone, type, roomId, tableId, checkIn, checkOut, branchId } = req.body;
    const booking = await prisma.booking.create({
      data: {
        guestName, guestPhone, type,
        roomId: roomId ? parseInt(roomId) : null,
        tableId: tableId ? parseInt(tableId) : null,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        branchId: parseInt(branchId) || 1
      }
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('new_notification', {
        id: Date.now(),
        type: 'booking',
        title: 'New Booking!',
        message: `${guestName} booked a ${type} · ${new Date(checkIn).toLocaleDateString()}`,
        time: new Date().toLocaleTimeString(),
        color: '#F5A623'
      });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

module.exports = router;