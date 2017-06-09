import ServiceModel from '../models/Service';
import BasicController from './BaseController';

export class Service extends BasicController {
	constructor() {
		super(ServiceModel);
	}
}

export default Service;
