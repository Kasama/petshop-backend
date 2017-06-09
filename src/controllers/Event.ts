import EventModel from '../models/Event';
import BasicController from './BaseController';

export class Event extends BasicController {
	constructor() {
		super(EventModel);
	}
}

export default Event;
