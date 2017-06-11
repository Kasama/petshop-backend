import ApplicationController from './ApplicationController';

import Client from '../models/Client';
import Admin from '../models/Admin';

export class Login extends ApplicationController {

	ClientModel: Client;
	AdminModel: Admin;

	constructor() {
		super();
		this.ClientModel = new Client();
		this.AdminModel = new Admin();
	}

	login() {
		const email = this.params['email'];
		const pass = this.params['password'];

		console.log('===========Trying to login ', email);
		console.log('===========with pass ', pass);

		this.AdminModel.find('email', [email], 1).then(model => {
			if (model.length > 0) {
				this.success({success: true, user: model[0], admin: true});
			} else {
				this.ClientModel.find('email', [email], 1).then(model => {
					if (model.length > 0) {
						this.success({success: true, user: model[0], admin: false});
					} else {
						this.success({success: false});
					}
				}).catch(this.fail);
			}
		}).catch(this.fail);
	}
}

export default Login;
