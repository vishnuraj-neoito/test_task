import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import ChildController from '../controllers/child.controller';
import validationMiddleware from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import { AddChildDto } from '../dtos/child.dto';

class ChildRoute implements Route {
	public path = '/child';
	public router = Router();
	public childController = new ChildController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(
			`${this.path}`,
			authMiddleware,
			validationMiddleware(AddChildDto),
			this.childController.addChild
		);

		this.router.get(
			`${this.path}`,
			authMiddleware,
			this.childController.getChildList
		);

		this.router.get(
			`${this.path}/byId`,
			authMiddleware,
			this.childController.getChildById
		);

		this.router.put(
			`${this.path}`,
			authMiddleware,
			this.childController.updateChild
		);

		this.router.delete(
			`${this.path}`,
			authMiddleware,
			this.childController.deleteChild
		);
	}
}

export default ChildRoute;
