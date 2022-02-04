require('dotenv-safe').config();
import App from './app';
import IndexRoute from '../src/routes/index.route';
import UserRoute from '../src/routes/user.route';
import validateEnv from '../src/utils/validateEnv';
import ChildRoute from './routes/child.route';
import CreditCardRoute from './routes/credit_card.route';

validateEnv();

const app = new App([
	new IndexRoute(),
	new UserRoute(),
	new ChildRoute(),
	new CreditCardRoute(),
]);

app.listen();
