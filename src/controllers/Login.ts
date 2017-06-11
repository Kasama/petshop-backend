import ApplicationController from './ApplicationController';
import ApplicationModel from '../models/ApplicationModel';

import Client from '../models/Client';
import Admin from '../models/Admin';

function get_user(model: ApplicationModel, admin?: boolean) {
	if (model) {
		return {
			success: true,
			model: model.normalizedModel(),
			admin: admin
		};
	} else {
		return {
			success: false
		};
	}
}
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
				this.success(get_user(model[0], true));
			} else {
				this.ClientModel.find('email', [email], 1).then(model => {
					if (model.length > 0) {
						this.success(get_user(model[0], false));
					} else {
						this.success(get_user(undefined));
					}
				}).catch(this.fail);
			}
		}).catch(this.fail);
	}
}

export default Login;
