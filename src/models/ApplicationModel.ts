import Database, { Couch } from '../db/db';
import * as fs from 'fs';

abstract class ApplicationModel implements Couch.Document {

	private database: Database<ApplicationModel>;
	private views: Couch.View[];
	private ref_names: {[key: string]: {name: string, model: ApplicationModel, field: string} };
	private is_referenced_by: { new(): ApplicationModel }[];
	private references: {[key: string]: ApplicationModel};
	public _id: string;
	public _rev: string;

	constructor(klass?: { new(): ApplicationModel }, base?: any) {
		this.database = new Database<ApplicationModel>(klass);
		this.generateExtraViews();
		this.waitForDatabase();
		this.ref_names = {};
		this.references = {};
		this.is_referenced_by = [];
		if (base) {
			if (base._id) this._id = base._id;
			if (base._rev) this._rev = base._rev;
		}
		this.update(base);
	}

	private waitForDatabase() {
		this.dbExists()
		.then((exists) => {
			if (!exists.exists) this.MakeDatabase();
		})
		.catch((err: Error) => {
			console.log('Failed to connect to database... retrying in 1s');
			setTimeout(this.waitForDatabase, 1000);
		});
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
	protected picture_attr(): string|undefined {
		return undefined;
	}

	protected refersTo(other_model: { new(): ApplicationModel }, field: string) {
		const name = other_model.name.toLowerCase();
		this.ref_names[field] = {
			name: name,
			model: new other_model(),
			field: field
		};
	}

	protected isReferencedBy(other_model: { new(): ApplicationModel }) {
		this.is_referenced_by.push(other_model);
	}

	public model(): any {
		const m = {};
		this.normalizedFields().forEach(field => {
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

	public fullModel(): any {
		const m = this.normalizedModel();
		for (const prop in this.ref_names) {
			delete m[prop];
			const reference = this.references[prop];
			m[this.ref_names[prop].name] = reference.fullModel();
		}
		return m;
	}

	public normalizedFields(): string[] {
		const fields = this.fields();
		if (this.picture_attr())
			fields.push(this.picture_attr());
		return fields;
	}

	protected generateExtraViews(): void { this.views = []; }

	// ================ Model Operations ================ \\

	public async setupReferences(): Promise<void> {
		for (const prop in this.ref_names) {
			const field = this.ref_names[prop].field;
			const ref_id = this[field];
			const model = this.ref_names[prop].model;
			const ref = await model.get(ref_id);
			this.references[prop] = ref;
		}
	}

	public update(data: any): void {
		if (data) this.normalizedFields().forEach(field => {
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

	public async find(what: string, value?: Array<string>, limit?: number, skip?: number): Promise<ApplicationModel[]> {
		return this.database.find_by(what, value, limit, skip);
	}

	public async all(limit?: number, skip?: number): Promise<ApplicationModel[]> {
		return this.database.all(limit, skip);
	}

	public async uploadFile(id: string, file: Express.Multer.File): Promise<Couch.Status> {
		// Saving file locally instead of on the Database
		// FIXME: Put file as an attachment to the database
		const publicPath = 'dist/public/';
		const newname = file.filename + file.mimetype.replace('image/', '.');
		fs.rename(file.path, publicPath + newname, () => {});
		const el = await this.get(id);
		if (el.picture_attr()) {
			console.log('attr: ' + JSON.stringify(el));
			console.log('deleting file: ' + el[el.picture_attr()]);
			fs.unlink(publicPath + el[el.picture_attr()], () => {});
			el[this.picture_attr()] = newname;
			return el.save();
		} else {
			fs.unlink(publicPath + newname, () => {});
			return Promise.reject('Model does not have a picture field');
		}
	}

	public async save(): Promise<Couch.Status> {
		const model = this.normalizedModel();
		if (this.picture_attr())
			model[this.picture_attr()] = this[this.picture_attr()];
		const status = await this.database.save(model);
		this._rev = status.data._rev;
		return status;
	}

	public async delete(): Promise<Couch.Status> {
		const toDelete = [] as ApplicationModel[];
		for (const ref of this.is_referenced_by) {
			const refField = this.constructor.name.toLowerCase() + '_id';
			const mod = await (new ref()).find(refField, [this._id]);
			toDelete.push(...mod);
		}
		return new Promise<Couch.Status>((accept, reject) => {
			this.database.delete(this.normalizedModel())
			.then(status => {
				if (status.success) {
					const proms = [];
					toDelete.forEach(model => {
						console.log('gonna delete: ', model._id);
						proms.push(model.delete());
					});
					status.data = this.normalizedModel();
					Promise.all(proms)
					.then(v => accept(status))
					.catch(e => {
						this.save()
						.then(s => reject(e))
						.catch(ee => reject([ee, e]));
					});
				}
			}).catch(reject);
		});
	}

}

export default ApplicationModel;
