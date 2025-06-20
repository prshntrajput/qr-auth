import { Server, Socket } from 'socket.io';
import { QRSessionManager } from '../qr/qrModel';
import { UserManager } from '../auth/userModel';
import QRCode from 'qrcode';

const qrManager = new QRSessionManager();
const userManager = new UserManager();

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Web app requests QR code
    socket.on('request-qr', async () => {
      try {
        const session = await qrManager.createSession(socket.id);
        const qrData = {
          sessionId: session.sessionId,
          timestamp: session.createdAt.getTime()
        };

        const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));

        socket.emit('qr-generated', {
          qrCode: qrCodeUrl,
          sessionId: session.sessionId,
          expiresAt: session.expiresAt
        });

        console.log('QR generated for session:', session.sessionId);
      } catch (error) {
        console.error('QR generation error:', error);
        socket.emit('error', { message: 'Failed to generate QR code' });
      }
    });

    // PWA app scans QR and sends data
    socket.on('qr-scanned', async (data) => {
      try {
        const { sessionId } = JSON.parse(data.qrData);
        const session = await qrManager.getSession(sessionId);

        if (session && typeof session.webSocketId === 'string') {
          // Notify web app that QR was scanned
          io.to(session.webSocketId).emit('qr-scan-detected', { sessionId });
          socket.emit('qr-valid', { sessionId });
        } else {
          socket.emit('qr-invalid', { message: 'QR code expired or invalid' });
        }
      } catch (error) {
        console.error('QR scan error:', error);
        socket.emit('qr-invalid', { message: 'Invalid QR code format' });
      }
    });

    // PWA app submits authentication
    socket.on('authenticate', async (data) => {
      try {
        const { sessionId, username, password, action } = data;
        const session = await qrManager.getSession(sessionId);

        if (!session) {
          socket.emit('auth-failed', { message: 'Session expired' });
          return;
        }

        let user;

        if (action === 'login') {
          user = await userManager.authenticateUser(username, password);
        } else if (action === 'register') {
          const existingUser = await userManager.getUserByUsername(username);
          if (existingUser) {
            socket.emit('auth-failed', { message: 'Username already exists' });
            return;
          }
          user = await userManager.createUser(username, data.email, password);
        }

        if (user) {
          await qrManager.authenticateSession(sessionId, user.id);

          if (typeof session.webSocketId === 'string') {
            io.to(session.webSocketId).emit('auth-success', {
              user: {
                id: user.id,
                username: user.username,
                email: user.email
              },
              sessionId
            });

            socket.emit('auth-success', { message: 'Authentication successful' });
          } else {
            socket.emit('auth-failed', { message: 'Session is missing WebSocket ID' });
          }

          await qrManager.invalidateSession(sessionId);
        } else {
          socket.emit('auth-failed', { message: 'Invalid credentials' });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit('auth-failed', { message: 'Authentication failed' });
      }
    });

    // On disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
