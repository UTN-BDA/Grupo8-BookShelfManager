import { UserRouter } from './routes/user-routes';
import userController from './controller/user-controller';

export const userRouter = new UserRouter(userController).getRouter();