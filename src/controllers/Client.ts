import ClientModel from '../models/Client';
import ApplicationController from './ApplicationController';

export class Client extends ApplicationController {

	static Model = new ClientModel();

	exists(): void{
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
		console.log("this is: " + JSON.stringify(this));
		Client.Model.get(this.params['id'])
		.then(this.success)
		.catch(this.fail);
	}

	getAll(): void {
		// this.doSomething(...args, Client.Model.all);
	}

	add(): void {
		let model: ClientModel;
		model = new ClientModel();
		console.log("recv params: " + JSON.stringify(this.params));
		model.age = this.params['age'];
		model.name = this.params['name'];
		model.save().then(this.success).catch(this.fail);
	}
}

export default Client;
