import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: String,
  passwordHash: String,
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.model('User', userSchema);
