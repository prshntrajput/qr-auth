import mongoose from 'mongoose';

const qrSessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true },
  userId: String,
  webSocketId: String
});

export const QRSessionModel = mongoose.model('QRSession', qrSessionSchema);
