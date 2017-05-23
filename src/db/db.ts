import * as request from 'request';

const url = 'http://191.189.112.147:5984';
// const url = 'http://localhost:5984';
const dbUser = 'admin';
const dbPass = 'admin';
const designDoc = '_design/docs';

// Needed for couchdb views
const emit: (key: string, value: any) => void = () => {};

export namespace Couch {
	export interface Document {
		_id?: string;
		_rev?: string;
	}
	export interface Existence {
		database: string;
		exists: boolean;
		message: string;
	}
	export interface Status {
		success: boolean;
		message?: string;
		data?: any;
	}
	export interface View {
		name: string;
		map: string;
		reduce?: string;
	}
}

function isOk(response: request.RequestResponse) {
	return (response.statusCode >= 200 && response.statusCode < 300);
}

class Database<T extends Couch.Document> {

	databaseName: string;
	databasePath: string;
	databaseView: string;
	databaseQuery: string;
	instance: { new(base?: any): T };

	constructor(instance: { new(base?: any): T }) {
		this.instance = instance;
		this.databaseName = instance.name.toLowerCase();
		this.databasePath = this.databaseName + '/';
		this.databaseView = this.databasePath + designDoc;
		this.databaseQuery = this.databaseView + '/_view/';
	}

	private async headerFor(path = '', form: any = {}): Promise<request.Options> {
		const ret = {
			url: url + '/' + path,
			json: true,
			auth: {
				user: dbUser,
				pass: dbPass,
			}
		} as request.Options;
		return Object.assign(ret, form);
	}

	makeDefaultViewFor(property: string): any {
		const underscore = property.startsWith('_') ? '' : '_';
		const name = 'by' + underscore + property;
		const mapFunc = 'function(doc) { emit(doc.' + property + ', doc); }';
		return this.makeViewFor({
			name: name,
			map: mapFunc
		});
	}

	private makeViewFor(view: Couch.View): any {
		const v = {};
		v[view.name] = { map: view.map };
		if (view['reduce'])
			v[view.name]['reduce'] = view.reduce;
		return v;
	}

	public async makeViewsFor(model: any, extra?: Couch.View[]): Promise<Couch.Status> {
		const doc = {
			_id: designDoc,
			language: 'javascript',
			views: {}
		};

		for (const prop in model) {
			if (model.hasOwnProperty(prop)) {
				doc.views = Object.assign(doc.views, this.makeDefaultViewFor(prop));
			}
		}

		if (extra) extra.forEach((v) => {
			doc.views = Object.assign(doc.views, this.makeViewFor(v));
		});

		const header = await this.headerFor(this.databaseView, {body: doc});
		return new Promise<Couch.Status>((accept, reject) => {
			request.put(
				header,
				(err: any, resp: request.RequestResponse, body: any) => {
					if (err) {
						reject(err);
					} else {
						if (resp.body['error']) {
							accept({success: false, message: resp.body['reason']});
						} else {
							accept({success: true});
						}
					}
				}
			);
		});
	}

	public async getUUID(): Promise<string> {
		const header = await this.headerFor('_uuids');
		return new Promise<string>((accept, reject) => {
			request.get(
				header,
				(err: any, resp: request.RequestResponse, body: any) => {
					if (err) reject(err);
					else accept(resp.body['uuids'][0]);
				}
			);
		});
	}

	public async save(data: any): Promise<Couch.Status> {
		let uuid: string;
		if (data._id)
			uuid = data._id;
		else {
			uuid = await this.getUUID();
			data._id = uuid;
		}
		const header = await this.headerFor(this.databasePath + uuid, {body: data});
		return new Promise<Couch.Status>((accept, reject) => {
			request.put(
				header,
				(err: any, resp: request.RequestResponse, body: any) => {
					if (err) {
						reject(err);
					} else {
						const status = {success: resp.body['ok']} as Couch.Status;
						if (resp.body['reason'])
							status.message = resp.body['reason'];
						accept(status);
					}
				}
			);
		});
	}

	public async find_by(what: string, value?: Array<string>): Promise<T[]> {
		const underscore = what.startsWith('_') ? '' : '_';
		const by = 'by' + underscore + what;
		let header;
		if (value) {
			const quotify = value.map(v => {
				if (v.startsWith('"') && v.endsWith('"'))
					return v;
				return '"' + v + '"';
			});
			const body = { qs: { keys: '[' + quotify.toString() + ']' } };
			header = await this.headerFor(this.databaseQuery + by, body);
		} else header = await this.headerFor(this.databaseQuery + by);
		return new Promise<T[]>((accept, reject) => {
			request.get(
				header,
				(err: any, resp: request.RequestResponse, body: any) => {
					if (err) {
						reject(err);
					} else {
						const rows: Array<any> = resp.body['rows'];
						if (rows) {
							accept(rows.map(row => {
								return new this.instance(row['value']);
							}));
						} else {
							accept([]);
						}
					}
				}
			);
		});
	}

	public async get(id: string): Promise<T> {
		return new Promise<T>((accept, reject) => {
			this.find_by('_id', [id])
			.then(acc => {
				if (acc[0])
					accept(acc[0]);
				else
					reject(new Error('member does not exist'));
			})
			.catch(e => reject(e));
		});
	}

	public async all(): Promise<T[]> {
		return new Promise<T[]>((accept, reject) => {
			this.find_by('_id')
			.then(acc => accept(acc))
			.catch(e => reject(e));
		});
	}

	public async delete(doc: Couch.Document): Promise<Couch.Status> {
		const data = { qs: {rev: doc._rev } };
		const header = await this.headerFor(this.databasePath + doc._id, data);
		return new Promise<Couch.Status>((accept, reject) => {
			request.delete(
				header,
				(err: any, resp: request.RequestResponse, body: any) => {
					if (err) {
						reject(err);
					} else {
						accept({ success: true });
					}
				}
			);
		});
	}

	public async exists(): Promise<Couch.Existence> {
		const header = await this.headerFor(this.databaseName);
		return new Promise<Couch.Existence>((accept, reject) => {
			request.get(
				header,
				(err: any, resp: request.RequestResponse, body: any) => {
					if (err) {
						reject(err);
					} else {
						let exists: boolean;
						if (resp.body['error']) exists = false;
						else exists = true;
						accept({
							database: this.databaseName,
							exists: exists,
							message: resp.body['reason']
						});
					}
				}
			);
		});
	}

	public async createDB(): Promise<Couch.Status> {
		const header = await this.headerFor(this.databaseName);
		return new Promise<Couch.Status>((accept, reject) => {
			request.put(
				header,
				(err: any, resp: request.RequestResponse, body: any) => {
					if (err) {
						reject(err);
					} else {
						if (resp.body['error']) {
							accept({
								success: false,
								message: resp.body['reason']
							});
						} else {
							accept({ success: resp.body['ok'] });
						}
					}
				}
			);
		});
	}

}

export default Database;
