import ApplicationModel from './ApplicationModel';

class Client extends ApplicationModel {

	public name: string;
	public age: number;

	constructor(base?: any) {
		super(Client, base);
	}

	fields(): string[] {
		return [
			'name',
			'age',
		];
	}
}

export default Client;
