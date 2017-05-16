import Model from '../models/Client';
import ApplicationController from './ApplicationController';

export class Client extends ApplicationController {

	exists(): void{
		Model.dbExists()
		.then(this.success)
		.catch(this.fail);
	}

	createDB(): void {
		Model.createDB()
		.then(this.success)
		.catch(this.fail);
	}

	get(): void {
		console.log("this is: " + JSON.stringify(this));
		Model.get(this.params['id'])
		.then(this.success)
		.catch(this.fail);
	}

	getAll(): void {
		// this.doSomething(...args, Model.all);
	}

	add(): void {
		let model: Model;
		model = new Model();
		console.log("recv params: " + JSON.stringify(this.params));
		model.age = this.params['age'];
		model.name = this.params['name'];
		model.save().then(this.success).catch(this.fail);
	}
}

export default Client;
