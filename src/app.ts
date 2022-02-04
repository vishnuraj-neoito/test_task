import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import passport from 'passport';
import sequelize from '../src/config/db';
import { __PROD__ } from './constants';
import Routes from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';
import * as strategies from './strategies/auth-strategy';
const compression = require('compression');

const models = require('../models').sequelize;

class App {
	public app: express.Application;
	public port: string | number;
	public env: boolean;

	constructor(routes: Routes[]) {
		this.app = express();
		this.port = process.env.PORT || 4000;
		this.env = __PROD__;

		this.connectToDatabase();
		this.initializeMiddlewares();
		this.initializeRoutes(routes);
		this.initializeErrorHandling();
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`Server running on PORT: ${this.port}`);
		});
	}

	public getServer() {
		return this.app;
	}

	private connectToDatabase() {
		sequelize.authenticate().then(async () => {
			console.log('*********** Database Connected **************');
			try {
				await models.sync({ [process.argv[2]]: true });
				console.log(
					'*********** Table Synchronize successfully **************'
				);
			} catch (err) {
				console.log(err);
			}
		});
	}

	private initializeMiddlewares() {
		this.app.set('etag', false);
		this.app.disable('view cache');
		this.app.use(passport.initialize());
		this.app.use(passport.session());
		this.app.use(express.json());
		this.app.use(compression()),
			this.app.use(
				express.urlencoded({
					extended: true,
				})
			);
		Object.values(strategies.default.local).forEach((strategy: any) => {
			strategy(passport);
		});
		if (this.env) {
			this.app.use(hpp());
			this.app.use(helmet());
			this.app.use(morgan('combined'));
			this.app.use(
				cors({
					origin: process.env.DOMAIN,
					credentials: true,
				})
			);
		} else {
			this.app.use(morgan('dev'));
			this.app.use(
				cors({
					origin: true,
					credentials: true,
				})
			);
		}
	}

	private initializeRoutes(routes: Routes[]) {
		routes.forEach((route) => this.app.use('/v1', route.router));
	}

	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}
}

export default App;
