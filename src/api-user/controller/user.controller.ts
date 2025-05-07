import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ErrorResponse } from '../../utils';
import { CreateUserParams, UpdateUserParams } from '../types/user.types';

const userService = new UserService();

export class UserController {}

export default new UserController();