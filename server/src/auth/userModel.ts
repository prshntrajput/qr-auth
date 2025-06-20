// server/src/auth/userModel.ts (MongoDB version)
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';

export class UserManager {
  async createUser(username: string, email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ username, email, passwordHash });
    return user;
  }

  async authenticateUser(username: string, password: string) {
    const user = await UserModel.findOne({ username });
   if (user && typeof user.passwordHash === 'string' && await bcrypt.compare(password, user.passwordHash)) {
  return user;
}

    return null;
  }

  async getUserById(id: string) {
    return UserModel.findById(id);
  }

  async getUserByUsername(username: string) {
    return UserModel.findOne({ username });
  }
}