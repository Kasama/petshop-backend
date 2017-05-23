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
		Client.Model.get(this.params['_id'])
		.then(this.success)
		.catch(this.fail);
	}

	delete(): void {
		const prom = Client.Model.get(this.params['_id']);
		prom.then(model => {
			model.delete().then(this.success).catch(this.fail);
		});
		prom.catch(this.fail);
	}

	getAll(): void {
		const resp = [];
		const promises: Promise<any>[] = [];
		let all = true;
		let limit = undefined;
		let skip = undefined;
		if (this.params['limit']) {
			if (this.params['limit'][0])
				limit = parseInt(this.params['limit'][0]);
			else limit = parseInt(this.params['limit']);
			delete this.params['limit'];
		}
		if (this.params['skip']) {
			if (this.params['skip'][0])
				skip = parseInt(this.params['skip'][0]);
			else skip = parseInt(this.params['skip']);
			delete this.params['skip'];
		}
		for (const k in this.params) {
			all = false;
			let params;
			if (this.params[k] instanceof Array)
				params = this.params[k];
			else
				params = [this.params[k]];

			promises.push(Client.Model.find(k, limit, skip, params));
		}
		if (all) promises.push(Client.Model.all(limit, skip));
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

	update(): void {
	}

}

export default Client;
