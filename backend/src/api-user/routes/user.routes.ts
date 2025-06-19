import { BaseRouter } from '../../utils';
import { UserController } from '../controller/user.controller';
import { requireAdmin } from '../middleware/auth.middleware';

export class UserRouter extends BaseRouter<UserController> {
  constructor(controller: UserController) {
    super(controller);
  }

  protected setRoutes(): void {
    // Rutas públicas
    this.router.post('/register', (req, res) => this.controller.registerUser(req, res));
    this.router.post('/login', (req, res) => this.controller.loginUser(req, res));
    
    // Rutas protegidas solo para administradores
    this.router.get('/', requireAdmin, (req, res) => this.controller.getAllUsers(req, res));
    this.router.get('/:id', requireAdmin, (req, res) => this.controller.getUserById(req, res));
    this.router.put('/:id', requireAdmin, (req, res) => this.controller.updateUser(req, res));
    this.router.delete('/:id', requireAdmin, (req, res) => this.controller.deleteUser(req, res));
  }
}