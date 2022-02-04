import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User } from '../interfaces/user.interface';
const Users = require('../../models').Users;
import HttpException from '../exceptions/HttpException';
import validateVersion from '../utils/apiVersionController';
import UserService from '../services/user.service';
import { UserRegisterDto } from '../dtos/users.dto';

class UserController {
	public userService = new UserService();

	public userRegister = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const userData: UserRegisterDto = req.body;
			const data = await this.userService.userRegister(userData);
			res.status(201).json({
				data: data,
				message: 'User registered successfully.',
				error: false,
				version: validateVersion(req.baseUrl),
			});
		} catch (error) {
			next(error);
		}
	};

	public userLogin = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (req.body.email === '' || req.body.password === '') {
			next(new HttpException(400, 'No valid data is passed'));
		}
		let checkEmail: string = req.body.email;
		const check_user = await Users.findOne({
			where: {
				email: checkEmail.toLowerCase(),
			},
		});
		if (check_user) {
			passport.authenticate(
				'login-strategy',
				{ session: false },
				async (err: HttpException, user: User) => {
					if (err) {
						next(err);
					} else {
						const access_token = this.userService.createToken(user, false);
						const refresh_token = this.userService.createToken(user, true);

						res.status(200).json({
							user: {
								id: check_user.id,
								name: check_user.name,
								email: check_user.email,
								access_token,
								refresh_token,
							},
							message: 'Login successful',
							error: false,
							version: validateVersion(req.baseUrl),
						});
					}
				}
			)(req, res, next);
		} else {
			next(new HttpException(404, 'Email address not found'));
		}
	};
}

export default UserController;
