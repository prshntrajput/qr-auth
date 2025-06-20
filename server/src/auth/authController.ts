// server/src/auth/authController.ts
import { Request, Response } from 'express';
import { UserManager } from './userModel';

const userManager = new UserManager();

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  try {
    const existing = await userManager.getUserByUsername(username);
    if (existing) {
      res.status(400).json({ message: 'Username already exists' });
      return
    }

    const user = await userManager.createUser(username, email, password);
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const user = await userManager.authenticateUser(username, password);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};