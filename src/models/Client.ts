import Database, { Couch } from '../db/db';

class Client implements Couch.Document {

	private static database: Database<Client> = new Database<Client>(Client);

	name: string;
	age: number;

	public static async cleanUp(): Promise<void> {
		return Client.database.cleanUp();
	}

	public static async dbExists(): Promise<Couch.Existence> {
		return Client.database.exists();
	}

	public static async createDB(): Promise<Couch.Status> {
		return Client.database.createDB();
	}

	public async save(): Promise<Couch.Status> {
		return Client.database.save(this);
	}

}

export default Client;
