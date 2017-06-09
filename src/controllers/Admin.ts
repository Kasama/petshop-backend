import AdminModel from '../models/Admin';
import Client from './Client';

export class Admin extends Client {
	constructor() {
		super(AdminModel);
	}
}

export default Admin;
