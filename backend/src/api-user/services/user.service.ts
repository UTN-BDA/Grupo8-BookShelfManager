import { prisma } from '../../config';
import { CreateUserParams, UpdateUserParams, User } from '../types/user.types';
import crypto from 'crypto';

export class UserService {
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async registerUser(params: CreateUserParams): Promise<Omit<User, 'password'>> {
    if (!params.email || !params.username) {
      throw new Error('Email y username son obligatorios');
    }

    const password = params.password || crypto.randomBytes(6).toString('hex');
    
    try {
      const user = await prisma.user.create({
        data: {
          email: params.email,
          username: params.username,
          password: this.hashPassword(password),
          firstName: params.firstName || 'Usuario',
          lastName: params.lastName || 'Nuevo',
        },
      });

      if (!params.password) console.log(`Contraseña para ${params.email}: ${password}`);
      
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error(`${error.meta?.target[0]} ya está en uso`);
      }
      throw error;
    }
  }

  async loginUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || user.password !== this.hashPassword(password)) return null;
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await prisma.user.findMany();
    return users.map(({ password, ...rest }) => rest);
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id: string, params: UpdateUserParams): Promise<Omit<User, 'password'> | null> {
    const data = { ...params };
    if (data.password) data.password = this.hashPassword(data.password);
    
    const user = await prisma.user.update({ where: { id }, data });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async deleteUser(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.delete({ where: { id } });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export default new UserService();