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
		console.log("client: " + JSON.stringify(this));
		console.log("client name: " + this.name);
		console.log("client age: " + this.age);
		return Client.database.save({name: this.name, age: this.age});
	}

}

export default Client;
