// server/src/qr/qrController.ts
import { Request, Response } from 'express';
import { QRSessionManager } from './qrModel';

const qrManager = new QRSessionManager();

export const getSessionInfo = (req: Request, res: Response): void => {
  const { sessionId } = req.params;
  const session = qrManager.getSession(sessionId);
  if (!session) {
    res.status(404).json({ message: 'Session not found or expired' });
    return
  }
  res.status(200).json(session);
};
