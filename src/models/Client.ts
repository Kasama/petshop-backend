import ApplicationModel from './ApplicationModel';

class Client extends ApplicationModel {

	name: string;
	age: number;

	constructor() {
		super(Client);
	}

}

export default Client;
