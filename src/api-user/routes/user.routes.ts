import { BaseRouter } from '../../utils';
import { UserController } from '../controller/user.controller';

export class UserRouter extends BaseRouter<UserController> {
  constructor(controller: UserController) {
    super(controller);
  }

  protected setRoutes(): void {
    // this.router.post('/', 
    //   (req, res) => this.controller.createUser(req, res)
    // ); 
  }
}