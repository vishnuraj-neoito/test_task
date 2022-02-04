import { Router } from 'express';
import validationMiddleware from '../middlewares/validation.middleware';
import UserController from '../controllers/user.controller';
import { LoginDto, UserRegisterDto } from '../dtos/users.dto';
import Route from '../interfaces/routes.interface';

class UserRoute implements Route {
	public path = '/user';
	public router = Router();
	public userController = new UserController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(
			`${this.path}/register`,
			validationMiddleware(UserRegisterDto),
			this.userController.userRegister
		);

		this.router.post(
			`${this.path}/login`,
			validationMiddleware(LoginDto),
			this.userController.userLogin
		);
	}
}

export default UserRoute;
