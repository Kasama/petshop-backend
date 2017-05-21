import Database, { Couch } from '../db/db';

abstract class ApplicationModel implements Couch.Document {

	private database: Database<ApplicationModel>;
	public _id: string;
	public _rev: string;

	constructor(klass) {
		this.database = new Database<ApplicationModel>(klass);
		this.dbExists()
		.then((exists) => {
			if(exists.exists) {
				console.log("didn't have to create db");
			} else {
				this.onCreateDB();
			}
		})
		.catch((err) => {
			console.log("Bad stuff: " + err);
		});
	}

	private onCreateDB(){
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

	private normalizedModel(): any {
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
