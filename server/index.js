const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const Task = require('./models/Task');
const authRoutes = require('./routes/auth.js');
const {
  createClerkClient,
  ClerkExpressRequireAuth,
} = require('@clerk/clerk-sdk-node');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const clerk = new createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

app.use(cors());
app.use(express.json());

// Middleware to verify Clerk session
const requireAuth = async (req, res, next) => {
  try {
    const sessionToken = req.headers.authorization?.split(' ')[1];
    console.log(sessionToken);
    if (!sessionToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const session = await clerk.sessions.verifySession(sessionToken);
    req.user = session;
    next();
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

app.use('/api/auth', authRoutes);
const taskRoutes = require('./routes/task')(io, ClerkExpressRequireAuth());
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('taskAdded', (task) => {
    socket.broadcast.emit('newTask', task);
  });

  socket.on('taskUpdated', (task) => {
    socket.broadcast.emit('updatedTask', task);
  });

  socket.on('taskDeleted', (taskId) => {
    socket.broadcast.emit('deletedTask', taskId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
