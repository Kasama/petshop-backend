import ApplicationModel from './ApplicationModel';

class Pet extends ApplicationModel {

	public name: string;
	public age: number;
	public race: string;
	public client_id: number;

	public picture: string;

	constructor(base?: any) {
		super(Pet, base);
	}

	fields(): string[] {
		return [
			'name',
			'age',
			'race',
			'client_id',
		];
	}

	picture_attr(): string {
		return 'picture';
	}
}

export default Pet;
