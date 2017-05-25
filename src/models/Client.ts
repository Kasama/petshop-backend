import ApplicationModel from './ApplicationModel';

class Client extends ApplicationModel {

	public name: string;
	public age: number;
	public picture: string;

	constructor(base?: any) {
		super(Client, base);
	}

	fields(): string[] {
		return [
			'name',
			'age',
		];
	}

	picture_attr(): string {
		return 'picture';
	}
}

export default Client;
