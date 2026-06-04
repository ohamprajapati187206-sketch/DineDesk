const express = require('express');
const prisma = require('../db');
const router = express.Router();

// Get all staff — filtered by branch
router.get('/', async (req, res) => {
  try {
    const { branchId } = req.query;
    const where = branchId ? { branchId: parseInt(branchId) } : {};
    const staff = await prisma.staff.findMany({
      where,
      include: { attendance: { orderBy: { date: 'desc' }, take: 1 } }
    });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// Add staff — attach branchId
router.post('/', async (req, res) => {
  try {
    const { name, role, department, phone, salary, branchId } = req.body;
    const staff = await prisma.staff.create({
      data: {
        name, role, department, phone,
        salary: parseFloat(salary),
        branchId: parseInt(branchId) || 1
      }
    });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create staff' });
  }
});

// Mark attendance
router.patch('/:id/attendance', async (req, res) => {
  try {
    const { status } = req.body;
    const attendance = await prisma.attendance.create({
      data: {
        staffId: parseInt(req.params.id),
        status
      }
    });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

module.exports = router;