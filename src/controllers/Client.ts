import ClientModel from '../models/Client';
import BaseController from './BaseController';

export class Client extends BaseController {
	constructor(modelKlass?) {
		if (modelKlass)
			super(modelKlass);
		else
			super(ClientModel);
	}

	login() {
		const prom = this.Model.find('email', [this.params['email']], 1, 0);
		prom.then(models => {
			const model = models[0];
			if (model) {
				this.success({
					success: true,
					user: {
						id: model._id,
						type: this.Model.constructor.name
					}
				});
			} else {
				this.fail(new Error('Invalid Email'));
			}
		}).catch(err => {
			this.fail(new Error('Invalid Email'));
		});
	}

	add() {
		let model: ClientModel;
		console.log('password: ', this.params['password']);
		console.log('confirma: ', this.params['password_confirmation']);
		if (this.params['password'] === this.params['password_confirmation']) {
			console.log('passwords matched');
			model = new this.ModelConstructor(this.params);
			model.save().then(this.success).catch(this.fail);
		} else {
			console.log('passwords didnt match');
			this.fail(new Error('password and confirmation do not match'));
		}
	}
}

export default Client;
