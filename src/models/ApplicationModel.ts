import Database, { Couch } from '../db/db';

abstract class ApplicationModel implements Couch.Document {

	private database: Database<ApplicationModel>;
	public _id: string;
	public _rev: string;

	constructor(klass?: { new(): ApplicationModel }, base?: any) {
		this.database = new Database<ApplicationModel>(klass);
		this.dbExists()
		.then((exists) => {
			if(exists.exists) {
				console.log("didn't have to create db");
			} else {
				this.MakeDatabase();
			}
		})
		.catch((err: Error) => {
			console.log("Bad stuff: " + err.message);
		});
		if (base) {
			this._id = base._id;
			this._rev = base._rev;
		}
	}

	private MakeDatabase(){
		this.createDB()
		.then((succ) => {
			console.log("Needed to create Database. Status: " + JSON.stringify(succ));
			if (succ.success){
				let viewProm = this.database.makeViewsFor(this.normalizedModel());
				viewProm.then((suc) => {
					console.log("creating views: " + JSON.stringify(suc));
				}).catch(e => {
					console.log("something bad happened while creating views: " + JSON.stringify(e));
				});
			}
		}).catch((err) => {
			console.log("Could not create database with error: " + JSON.stringify(err));
		});
	}

	public abstract model(): any;

	public normalizedModel(): any {
		let m = this.model();
		m._id = this._id;
		m._rev = this._rev;
		return m;
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
		return this.database.save(this.normalizedModel());
	}

}

export default ApplicationModel;
