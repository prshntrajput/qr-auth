import { v4 as uuidv4 } from 'uuid';
import { QRSessionModel } from '../models/QrSession';

export class QRSessionManager {
  async createSession(webSocketId: string) {
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const session = await QRSessionModel.create({
      sessionId,
      createdAt: new Date(),
      expiresAt,
      isActive: true,
      webSocketId
    });

    // Cleanup session after expiration
    setTimeout(async () => {
      await this.invalidateSession(sessionId);
    }, 5 * 60 * 1000);

    return session;
  }

  async getSession(sessionId: string) {
    const session = await QRSessionModel.findOne({ sessionId, isActive: true });
    if (session && session.expiresAt && session.expiresAt > new Date()) {
  return session;
}

    return undefined;
  }

  async authenticateSession(sessionId: string, userId: string) {
    const session = await QRSessionModel.findOne({ sessionId });
    if (session && session.expiresAt && session.expiresAt > new Date()) {
      session.userId = userId;
      await session.save();
      return true;
    }
    return false;
  }

  async invalidateSession(sessionId: string) {
    await QRSessionModel.updateOne({ sessionId }, { isActive: false });
  }
}