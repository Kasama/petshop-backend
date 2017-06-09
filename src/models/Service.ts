import ApplicationModel from './ApplicationModel';

class Service extends ApplicationModel {

	public name: string;
	public description: number;
	public price: number;
	public picture: string;

	constructor(base?: any) {
		super(Service, base);
	}

	fields(): string[] {
		return [
			'name',
			'description',
			'price',
		];
	}

	picture_attr(): string {
		return 'picture';
	}
}

export default Service;
