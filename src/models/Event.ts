import ApplicationModel from './ApplicationModel';
import Pet from './Pet';
import Service from './Service';

class Event extends ApplicationModel {

	public name: string;
	public date: string;
	public slot: number;
	public pet_id: string;
	public service_id: string;

	constructor(base?: any) {
		super(Event, base);
		this.refersTo(Pet, 'pet_id');
		this.refersTo(Service, 'service_id');
	}

	fields(): string[] {
		return [
			'name',
			'date',
			'slot',
			'pet_id',
			'service_id',
		];
	}
}

export default Event;
