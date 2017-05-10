import Client, { CouchDoc } from 'davenport';

interface ClientInterface extends CouchDoc {
	name: string,
	age: number,
}

export class ClientModel {

	database: Client<ClientInterface>;

	constructor() {
		this.database = new Client<ClientInterface> ('http://localhost:5984/', 'clients');
	}
}



export default ClientModel;
