import { NextFunction, Request, Response } from 'express';
import {
	AddChildDto,
	CommonListDto,
	GetChildByIdDto,
	UpdateChildDto,
} from '../dtos/child.dto';
import validateVersion from '../utils/apiVersionController';
import ChildService from '../services/child.service';
import { User } from '../interfaces/user.interface';

class ChildController {
	public childService = new ChildService();

	public addChild = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const childData: AddChildDto = req.body;
			const { id } = req.user as User;
			const data = await this.childService.addChild(childData, id);
			res.status(201).json({
				data: data,
				message: 'Child added successfully.',
				error: false,
				version: validateVersion(req.baseUrl),
			});
		} catch (error) {
			next(error);
		}
	};

	public getChildList = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { page, limit } = (req.query as unknown) as CommonListDto;
			const { id } = req.user as User;
			const data = await this.childService.getChildList({ page, limit }, id);
			res.status(201).json({
				data: data,
				message: 'Child List.',
				error: false,
				version: validateVersion(req.baseUrl),
			});
		} catch (error) {
			next(error);
		}
	};

	public getChildById = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { child_id } = (req.query as unknown) as GetChildByIdDto;
			const data = await this.childService.getChildById({ child_id });
			res.status(201).json({
				data: data,
				message: 'Child By Id.',
				error: false,
				version: validateVersion(req.baseUrl),
			});
		} catch (error) {
			next(error);
		}
	};

	public updateChild = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const childData: UpdateChildDto = req.body;
			const { id } = req.user as User;
			const data = await this.childService.updateChild(childData, id);
			res.status(201).json({
				data: data,
				message: 'Child details updated successfully.',
				error: false,
				version: validateVersion(req.baseUrl),
			});
		} catch (error) {
			next(error);
		}
	};

	public deleteChild = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { child_id } = (req.query as unknown) as GetChildByIdDto;
			const data = await this.childService.deleteChild({ child_id });
			res.status(201).json({
				data: data,
				message: 'Child deleted successfully.',
				error: false,
				version: validateVersion(req.baseUrl),
			});
		} catch (error) {
			next(error);
		}
	};
}

export default ChildController;
