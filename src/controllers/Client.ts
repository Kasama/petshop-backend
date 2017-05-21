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
		Client.Model.all()
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
