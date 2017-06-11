import ApplicationRouter from './ApplicationRouter';
import LoginController from '../controllers/Login';

export class Login extends ApplicationRouter {

	controller: LoginController;

	constructor() {
		super(new LoginController());
	}

	init() {
		this.post('/', this.controller.login);
	}
}

export default new Login();
