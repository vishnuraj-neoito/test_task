import _ from 'lodash';
import bcrypt from 'bcrypt';
import { UserRegisterDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import jwt from 'jsonwebtoken';
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface';
const Users = require('../../models').Users;

class UserService {
	public async userRegister(userData: UserRegisterDto) {
		if (_.isEmpty(userData)) {
			throw new HttpException(400, 'Nothing found on user data');
		}
		let email = userData.email.toLowerCase();
		const user = await Users.findOne({
			where: {
				email: email,
			},
		});
		if (user) {
			throw new HttpException(400, 'Email already exists');
		}

		const hashedPass = await bcrypt.hash(userData.password, 10);

		const newUser = await Users.create({
			...userData,
			email: email,
			password: hashedPass,
		});

		return { id: newUser.id, name: newUser.name, email: newUser.email };
	}

	public createToken(user: any, refresh: boolean): TokenData {
		const dataStoredInToken: DataStoredInToken = {
			id: user.id,
		};
		const secret: string = process.env.JWT_SECRET as string;
		const expiresIn: number = refresh ? 1209600000 : 60 * 60;

		return {
			expiresIn,
			token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
		};
	}
}

export default UserService;
