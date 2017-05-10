import Client from '../models/ClientModel';

export class ClientController {

	model: Client;

	constructor() {
		this.model = new Client();
	}

	getAllClients(callback): void {
		this.model.database.find().then(callback);
	}
}

export default ClientController;
