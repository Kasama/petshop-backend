import ApplicationModel from './ApplicationModel';

class Client extends ApplicationModel {

	public name: string;
	public age: number;

	constructor(base?: any) {
		super(Client, base);
		if (base) {
			this.name = base.name;
			this.age = base.age;
		}
	}

	model(): any {
		return {
			name: this.name,
			age: this.age
		}
	}

}

export default Client;
