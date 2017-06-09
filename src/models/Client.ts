import ApplicationModel from './ApplicationModel';

class Client extends ApplicationModel {

	public name: string;
	public surname: string;
	public address: string;
	public phone: string;
	public email: string;
	public password: string;

	public picture: string;

	constructor(base?: any) {
		super(Client, base);
	}

	fields(): string[] {
		return [
			'name',
			'surname',
			'address',
			'phone',
			'email',
			'password',
		];
	}

	picture_attr(): string {
		return 'picture';
	}
}

export default Client;
