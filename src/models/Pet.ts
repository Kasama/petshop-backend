import ApplicationModel from './ApplicationModel';
import Client from './Client';
import Event from './Event';

class Pet extends ApplicationModel {

	public name: string;
	public age: number;
	public race: string;
	public client_id: string;

	public picture: string;

	constructor(base?: any) {
		super(Pet, base);
		this.refersTo(Client, 'client_id');
		this.isReferencedBy(Event);
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
