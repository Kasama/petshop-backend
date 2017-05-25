import Database, { Couch } from '../db/db';

abstract class ApplicationModel implements Couch.Document {

	private database: Database<ApplicationModel>;
	private views: Couch.View[];
	public _id: string;
	public _rev: string;

	constructor(klass?: { new(): ApplicationModel }, base?: any) {
		this.database = new Database<ApplicationModel>(klass);
		this.generateExtraViews();
		this.dbExists()
		.then((exists) => {
			if (!exists.exists) this.MakeDatabase();
		})
		.catch((err: Error) => {
			console.log('Bad stuff: ' + err.message);
		});
		if (base) {
			if (base._id) this._id = base._id;
			if (base._rev) this._rev = base._rev;
		}
		this.update(base);
	}

	private MakeDatabase() {
		this.createDB()
		.then((succ) => {
			console.log('Needed to create Database. Status: ' + JSON.stringify(succ));
			if (succ.success) {
				const viewProm = this.database.makeViewsFor(this.normalizedModel(), this.views);
				viewProm.then((suc) => {
					console.log('creating views: ' + JSON.stringify(suc));
				}).catch(e => {
					console.log('something bad happened while creating views: ' + JSON.stringify(e));
				});
			}
		}).catch((err) => {
			console.log('Could not create database with error: ' + JSON.stringify(err));
		});
	}

	// ================= Model Attributes ================= \\

	protected abstract fields(): string[];

	public model(): any {
		const m = {};
		this.fields().forEach(field => {
			m[field] = this[field];
		});
		return m;
	}

	public normalizedModel(): any {
		const m = this.model();
		m._id = this._id;
		m._rev = this._rev;
		return m;
	}

	protected generateExtraViews(): void { this.views = []; }

	// ================ Model Operations ================ \\

	public update(data: any): void {
		if (data) this.fields().forEach(field => {
			if (data[field]) {
				this[field] = data[field];
			}
		});
	}

	// ================ Database Operations ================ \\

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

	public async find(what: string, limit?: number, skip?: number, value?: Array<string>): Promise<ApplicationModel[]> {
		return this.database.find_by(what, limit, skip, value);
	}

	public async all(limit?: number, skip?: number): Promise<ApplicationModel[]> {
		return this.database.all(limit, skip);
	}

	public async uploadFile(id: string, file: Express.Multer.File): Promise<Couch.Status> {
		return this.database.saveAttachment(id, file);
	}

	public async save(): Promise<Couch.Status> {
		const status = await this.database.save(this.normalizedModel());
		this._rev = status.data._rev;
		return status;
	}

	public async delete(): Promise<Couch.Status> {
		return new Promise<Couch.Status>((accept, reject) => {
			this.database.delete(this.normalizedModel())
			.then(status => {
				if (status.success) status.data = this.normalizedModel();
				accept(status);
			}).catch(reject);
		});
	}

}

export default ApplicationModel;
