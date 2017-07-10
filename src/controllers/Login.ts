import ApplicationController from './ApplicationController';
import ApplicationModel from '../models/ApplicationModel';

import Client from '../models/Client';
import Admin from '../models/Admin';

function get_user(model: ApplicationModel, admin?: boolean) {
	if (model) {
		return {
			success: true,
			model: model.fullModel(),
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

		this.AdminModel.find('email', [email], 1).then((model: Admin[]) => {
			if (model.length > 0) {
				if (model[0].password === pass) {
					this.success(get_user(model[0], true));
				} else {
					this.success(get_user(undefined));
				}
			} else {
				this.ClientModel.find('email', [email], 1).then((model: Client[]) => {
					if (model.length > 0) {
						if (model[0].password === pass) {
							this.success(get_user(model[0], false));
						} else {
							this.success(get_user(undefined));
						}
					} else {
						this.success(get_user(undefined));
					}
				}).catch(this.fail);
			}
		}).catch(this.fail);
	}
}

export default Login;
