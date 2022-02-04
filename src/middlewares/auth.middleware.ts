import { Request, NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { attributes } from '../utils/getFilterData';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken } from '../interfaces/auth.interface';
const Users = require('../../models').Users;

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
	res.set('Cache-Control', 'no-store');
	const bearerToken: string | undefined = req.headers.authorization;
	const token: string | undefined = bearerToken && bearerToken.split(' ')[1];
	if (token) {
		const secret = process.env.JWT_SECRET;
		try {
			const verificationResponse = jwt.verify(
				token,
				secret as jwt.Secret
			) as DataStoredInToken;
			const userId = verificationResponse.id;

			const findUser = await Users.findOne({
				where: { id: userId },
				attributes: attributes,
			});
			if (findUser) {
				req.user = findUser;
				next();
			} else {
				next(new HttpException(401, 'Wrong authentication token'));
			}
		} catch (error) {
			next(new HttpException(401, 'Wrong authentication token'));
		}
	} else {
		next(new HttpException(404, 'Authentication token missing'));
	}
}

export default authMiddleware;
