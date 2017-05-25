import ClientModel from '../models/Client';
import BaseController from './BaseController';

export class Client extends BaseController {
	constructor() {
		super(ClientModel);
	}
}

export default Client;
