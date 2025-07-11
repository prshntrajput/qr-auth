// server/src/index.ts (add route handlers)
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSocketHandlers } from './socket/socketHandlers';
import { login, register } from './auth/authController';
import { getSessionInfo } from './qr/qrController';
import { validateAuthFields } from './middleware/validation';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

dotenv.config();

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://qr-auth-l7gu.vercel.app", "https://qr-auth-lemon.vercel.app"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// REST Auth Routes
app.post('/api/auth/login', validateAuthFields, login);
app.post('/api/auth/register', validateAuthFields, register);

// QR Session Info Route
app.get('/api/qr/:sessionId', getSessionInfo);

// Setup WebSocket handlers
setupSocketHandlers(io);

connectDB();
const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
