import ApplicationModel from './ApplicationModel';

class Event extends ApplicationModel {

	public name: string;
	public date: string;
	public slot: number;
	public pet_id: string;
	public service_id: string;

	constructor(base?: any) {
		super(Event, base);
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
