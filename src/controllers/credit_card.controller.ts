import { Request, Response, NextFunction } from 'express';
import {
	AddCreditCardDto,
	ChargeCardDto,
	GetCreditCardByIdDto,
	TransactionsListDto,
	UpdateCardDto,
} from '../dtos/credit_card.dto';
import { User } from '../interfaces/user.interface';
import validateVersion from '../utils/apiVersionController';
import CreditCardService from '../services/credit_card.service';
import { CommonListDto } from '../dtos/child.dto';

class CreditCardController {
	public creditCardService = new CreditCardService();

	public addCreditCard = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const creditCardData: AddCreditCardDto = req.body;
			const { id } = req.user as User;
			const data = await this.creditCardService.addCreditCard(
				creditCardData,
				id
			);
			res.status(201).json({
				data: data,
				message: 'Credit card added successfully.',
				error: false,
				version: validateVersion(req.baseUrl),
			});
		} catch (error) {
			next(error);
		}
	};

	public getCreditCards = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const queryParams = (req.query as unknown) as CommonListDto;
			const { id } = req.user as User;
			const data = await this.creditCardService.getCreditCards(queryParams, id);
			res.status(201).json({
				data: data,
				message: 'Credit card list.',
				error: false,
				version: validateVersion(req.baseUrl),
			});
		} catch (error) {
			next(error);
		}
	};

	public getCreditCardById = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const queryParams = (req.query as unknown) as GetCreditCardByIdDto;
			const data = await this.creditCardService.getCreditCardById(queryParams);
			res.status(201).json({
				data: data,
				message: 'Credit card by Id.',
				error: false,
				version: validateVersion(req.baseUrl),
			});
		} catch (error) {
			next(error);
		}
	};

	public updateCreditCard = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const queryParams: UpdateCardDto = req.body;
			const { id } = req.user as User;
			const data = await this.creditCardService.updateCreditCard(
				queryParams,
				id
			);
			res.status(201).json({
				data: data,
				message: 'Credit card updated Successfully.',
				error: false,
				version: validateVersion(req.baseUrl),
			});
		} catch (error) {
			next(error);
		}
	};

	public deleteCreditCard = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const queryParams = (req.query as unknown) as GetCreditCardByIdDto;
			const data = await this.creditCardService.deleteCreditCard(queryParams);
			res.status(201).json({
				data: data,
				message: 'Credit card deleted successfully',
				error: false,
				version: validateVersion(req.baseUrl),
			});
		} catch (error) {
			next(error);
		}
	};

	public chargeTheCreditCard = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const queryParams: ChargeCardDto = req.body;
			const { id } = req.user as User;
			const data = await this.creditCardService.chargeTheCard(queryParams, id);
			res.status(201).json({
				data: data,
				message: 'Credit card charged Successfully.',
				error: false,
				version: validateVersion(req.baseUrl),
			});
		} catch (error) {
			next(error);
		}
	};

	public transactionsList = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const queryParams = (req.query as unknown) as TransactionsListDto;
			const { id } = req.user as User;
			const data = await this.creditCardService.getTransactionList(
				queryParams,
				id
			);
			res.status(201).json({
				data: data,
				message: 'Transactions list.',
				error: false,
				version: validateVersion(req.baseUrl),
			});
		} catch (error) {
			next(error);
		}
	};
}

export default CreditCardController;
