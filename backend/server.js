const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const socketIo = require('socket.io');
const friendsRoutes = require('./routes/friends');
const messagesRoutes = require('./routes/messages');
const auth = require('./middleware/auth');
const Message = require('./models/Message');
const postsRoutes = require('./routes/posts');
const connectDB = require('./config/connectDB');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",   // frontend url
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'x-auth-token'], // Allow these headers
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173",      // frontend url
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'x-auth-token'], // Allow these headers
  credentials: true
}));

app.use(express.json());

// Serve static files
app.use('/uploads', express.static('uploads'));

// MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/friends', friendsRoutes);
app.use('/api/profile', require('./routes/profile'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/messages', auth, messagesRoutes);
app.use('/api/auth', require('./routes/user'));
app.use('/api/posts', postsRoutes);

// Track users and their socket IDs
const users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Room management for chat sessions
  socket.on('join', ({ userId, friendId }) => {
    const roomName = [userId, friendId].sort().join('_');
    socket.join(roomName);
    console.log(`User ${userId} joined room ${roomName}`);
  });

  // Sending messages to the correct room
  socket.on('sendMessage', async (messageData) => {
    try {
      console.log('Message Data:', messageData);
      const newMessage = new Message(messageData);
      await newMessage.save();

      const roomName = [messageData.userId, messageData.friendId].sort().join('_');
      io.to(roomName).emit('receiveMessage', newMessage);
      console.log(`Message sent to room ${roomName}`);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Authentication API');
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`)
} );
