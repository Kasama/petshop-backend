import Database, { Couch } from '../db/db';

abstract class ApplicationModel implements Couch.Document {

	private static _database: Database<ApplicationModel>;
	protected static klass;

	protected static get database(): Database<ApplicationModel> {
		if (!ApplicationModel._database) {
			ApplicationModel._database = new Database<ApplicationModel>(ApplicationModel.klass);
		}
		return ApplicationModel._database;
	}

	public static async cleanUp(): Promise<void> {
		return ApplicationModel.database.cleanUp();
	}

	public static async dbExists(): Promise<Couch.Existence> {
		return ApplicationModel.database.exists();
	}

	public static async createDB(): Promise<Couch.Status> {
		return ApplicationModel.database.createDB();
	}

	public static async get(id: string): Promise<ApplicationModel> {
		return ApplicationModel.database.get(id);
	}

	public static async all(): Promise<ApplicationModel[]> {
		return ApplicationModel.database.all();
	}

	public async save(): Promise<Couch.Status> {
		return ApplicationModel.database.save(this);
	}

}

export default ApplicationModel;
