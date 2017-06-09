import ClientModel from '../models/Client';
import BaseController from './BaseController';

export class Client extends BaseController {
	constructor() {
		super(ClientModel);
	}

	login() {
		this.success({success: true});
	}
}

export default Client;
