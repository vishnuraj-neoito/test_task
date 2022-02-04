import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import passport from 'passport';
import HttpException from '../../exceptions/HttpException';

const Users = require('../../../models').Users;

const LocalStrategy = passportLocal.Strategy;

function localStart() {
	passport.use(
		'login-strategy',
		new LocalStrategy(
			{ usernameField: 'email' },
			async (email, password, done) => {
				let checkEmail: string = email.toLowerCase();
				const user = await Users.findOne({
					where: { email: checkEmail },
				});
				if (!user) {
					return done(new HttpException(404, 'Email address not found'));
				}

				await bcrypt.compare(password, user.password, (err, isMatch) => {
					if (err) {
						done(err);
					}
					if (isMatch) {
						return done(null, {
							id: user.id,
							name: user.name,
							email: user.email,
						});
					} else {
						return done(new HttpException(401, 'Password is incorrect'));
					}
				});
			}
		)
	);
}

export default localStart;
