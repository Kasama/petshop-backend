import ClientModel from '../models/Client';
import ApplicationController from './ApplicationController';

export class Client extends ApplicationController {

	static Model = new ClientModel();

	exists(): void {
		Client.Model.dbExists()
		.then(this.success)
		.catch(this.fail);
	}

	createDB(): void {
		Client.Model.createDB()
		.then(this.success)
		.catch(this.fail);
	}

	get(): void {
		console.log('this is: ' + JSON.stringify(this));
		Client.Model.get(this.params['id'])
		.then(this.success)
		.catch(this.fail);
	}

	getAll(): void {
		Promise.resolve();
		const resp = [];
		const promises: Promise<any>[] = [];
		for (const k in this.params) {
			console.log('finding param ' + k + ' = ' + this.params[k]);
			let prom: Promise<any>;
			if (k) {
				if (this.params[k] instanceof Array)
					prom = Client.Model.find(k, this.params[k]);
				else
					prom = Client.Model.find(k, [this.params[k]]);
			} else {
				prom = Client.Model.all();
			}
			promises.push(prom);
		}
		Promise.all(promises)
		.then(vals => [ ...new Set([].concat(...vals))])
		.then(this.success)
		.catch(this.fail);
	}

	add(): void {
		let model: ClientModel;
		model = new ClientModel();
		model.age = this.params['age'];
		model.name = this.params['name'];
		model.save().then(this.success).catch(this.fail);
	}
}

export default Client;
