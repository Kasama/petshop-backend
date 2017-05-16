import Database, { Couch } from '../db/db';

abstract class ApplicationModel implements Couch.Document {

	private database: Database<ApplicationModel>;

	constructor(klass) {
		this.database = new Database<ApplicationModel>(klass);
	}

	public async cleanUp(): Promise<void> {
		// return this.database.cleanUp();
	}

	public async dbExists(): Promise<Couch.Existence> {
		return this.database.exists();
	}

	public async createDB(): Promise<Couch.Status> {
		return this.database.createDB();
	}

	public async get(id: string): Promise<ApplicationModel> {
		return this.database.get(id);
	}

	public async all(): Promise<ApplicationModel[]> {
		return this.database.all();
	}

	public async save(): Promise<Couch.Status> {
		return this.database.save(this);
	}

}

export default ApplicationModel;
