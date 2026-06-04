require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const webhookRoutes = require('./routes/webhook');
app.use('/api/webhook', webhookRoutes);

const branchRoutes = require('./routes/branches');
app.use('/api/branches', branchRoutes);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// Make io accessible in all route files
app.set('io', io);

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/payment', require('./routes/payment'));

app.get('/', (req, res) => {
  res.json({ message: 'DineDesk Backend is running!' });
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Dashboard connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Dashboard disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`DineDesk server running on port ${PORT}`);
});