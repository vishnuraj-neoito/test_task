import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import CreditCardController from '../controllers/credit_card.controller';
import Route from '../interfaces/routes.interface';
class CreditCardRoute implements Route {
	public path = '/credit-cards';
	public router = Router();
	public creditCardController = new CreditCardController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(
			`${this.path}`,
			authMiddleware,
			this.creditCardController.addCreditCard
		);

		this.router.get(
			`${this.path}`,
			authMiddleware,
			this.creditCardController.getCreditCards
		);

		this.router.get(
			`${this.path}/byId`,
			authMiddleware,
			this.creditCardController.getCreditCardById
		);

		this.router.put(
			`${this.path}`,
			authMiddleware,
			this.creditCardController.updateCreditCard
		);

		this.router.delete(
			`${this.path}`,
			authMiddleware,
			this.creditCardController.deleteCreditCard
		);

		this.router.put(
			`${this.path}/charge`,
			authMiddleware,
			this.creditCardController.chargeTheCreditCard
		);

		this.router.get(
			`${this.path}/transactions`,
			authMiddleware,
			this.creditCardController.transactionsList
		);
	}
}

export default CreditCardRoute;
