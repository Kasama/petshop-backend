import Client from '../models/ClientModel';

export class ClientController {

	exists(
		success: (answer: any) => void,
		fail: (err: any) => void
	): void {
		const promise = Client.dbExists();
		promise.then(success);
		promise.catch(fail);
	}

	createDB(
		success: (answer: any) => void,
		fail: (err: any) => void
	): void {
		const promise = Client.createDB();
		promise.then(success);
		promise.catch(fail);
	}

	getAllClients(
		success: (model: object) => void,
		fail: (err: any) => void
	): void {
		/*
			const promise = this.model.database.listWithoutDocs();
			promise.then((client) => success(client));
			promise.catch((err) => fail(err));
			*/
	}

	addClient(
		params: any,
		success: (model: object) => void,
		fail: (err: any) => void
	): void {
		/*
		const newClient: ClientInterface = {name, age};
		const promise = this.model.database.post(newClient);
		promise.then((client) => success(client));
		promise.catch((err) => fail(err));
		*/
	}
}

export default ClientController;
