import { BaseRouter } from '../../utils';
import { UserController } from '../controller/user.controller';

export class UserRouter extends BaseRouter<UserController> {
  constructor(controller: UserController) {
    super(controller);
  }

  protected setRoutes(): void {
    // Auth routes
    this.router.post('/register', (req, res) => this.controller.registerUser(req, res));
    this.router.post('/login', (req, res) => this.controller.loginUser(req, res));
    
    // CRUD routes
    this.router.get('/', (req, res) => this.controller.getAllUsers(req, res));
    this.router.get('/:id', (req, res) => this.controller.getUserById(req, res));
    this.router.put('/:id', (req, res) => this.controller.updateUser(req, res));
    this.router.delete('/:id', (req, res) => this.controller.deleteUser(req, res));
  }
}