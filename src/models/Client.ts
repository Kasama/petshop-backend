import ApplicationModel from './ApplicationModel';

class Client extends ApplicationModel {

	public name: string;
	public age: number;

	constructor() {
		super(Client);
	}

	model(): any {
		return {
			name: this.name,
			age: this.age
		}
	}

}

export default Client;
