import ApplicationModel from './ApplicationModel';

class Admin extends ApplicationModel {

	public name: string;
	public surname: string;
	public birthday: string;
	public phone: string;
	public email: string;
	public password: string;

	public picture: string;

	constructor(base?: any) {
		super(Admin, base);
	}

	fields(): string[] {
		return [
			'name',
			'surname',
			'birthday',
			'phone',
			'email',
			'password',
		];
	}

	picture_attr(): string {
		return 'picture';
	}
}

export default Admin;
