import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ErrorResponse } from '../../utils';
import { CreateUserParams, UpdateUserParams } from '../types/user.types';

const userService = new UserService();

export class UserController {
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const params: CreateUserParams = req.body;

      if (!params.email || !params.username || !params.password) {
        res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos: email, username y password son obligatorios'
        });
        return;
      }

      const user = await userService.registerUser(params);
      res.status(201).json(user);
    } catch (error: any) {

      if (error.code === 'P2002') {
        res.status(409).json({
          success: false,
          message: `El campo ${error.meta?.target[0]} ya está en uso`,
          field: error.meta?.target[0]
        });
      } else if (error.name === 'PrismaClientKnownRequestError' || error.name === 'PrismaClientValidationError') {
        res.status(400).json({
          success: false,
          message: error.message ?? 'Error de validación de datos',
          code: error.code
        });
      } else {
        ErrorResponse.handleError(res, error);
      }
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ message: 'Email y contraseña son requeridos' });
        return;
      }

      const user = await userService.loginUser(email, password);
      
      if (!user) {
        res.status(401).json({ message: 'Credenciales inválidas' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      ErrorResponse.handleError(res, error);
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      ErrorResponse.handleError(res, error);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);
      
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      
      res.status(200).json(user);
    } catch (error) {
      ErrorResponse.handleError(res, error);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const params: UpdateUserParams = req.body;
      const updatedUser = await userService.updateUser(userId, params);
      
      if (!updatedUser) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      
      res.status(200).json(updatedUser);
    } catch (error) {
      ErrorResponse.handleError(res, error);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const deletedUser = await userService.deleteUser(userId);
      
      if (!deletedUser) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      ErrorResponse.handleError(res, error);
    }
  }
}

export default new UserController();