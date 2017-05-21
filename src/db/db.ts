import * as request from 'request';

// const url = 'http://191.189.112.147:5984';
const url = 'http://localhost:5984';
const dbUser = 'admin';
const dbPass = 'admin';

// Needed for couchdb views
var emit: (key: string, value: any) => void;

export module Couch {
	export interface Document {
		_id?: string,
		_rev?: string,
	}
	export interface Existence {
		database: string,
		exists: boolean,
		message: string
	}
	export interface Status {
		success: boolean,
		message?: string,
		data?: any
	}
	export interface View {
		_id: string,
		_rev: string,
		views: any
	}
}

function isOk(response: request.RequestResponse){
	return (response.statusCode >= 200 && response.statusCode < 300);
}

class Database<T extends Couch.Document> {

	databaseName: string;
	databasePath: string;

	constructor(instance: { new(): T }) {
		this.databaseName = instance.name.toLowerCase();
		this.databasePath = this.databaseName + '/';
	}

	private async headerFor(path: string = '', form: any = {}): Promise<request.Options> {
		let ret = {
			url: url + '/' + path,
			json: true,
			auth: {
				user: dbUser,
				pass: dbPass,
			}
		} as request.Options;
		return Object.assign(ret, form);
	}

	private makeViewFor(property: string): any {
		const underscore = property.startsWith('_') ? '' : '_';
		const name = "by" + underscore + property;
		const mapFunc = "function(doc) { emit(doc." + property + ", doc); }";
		const redFunc = '';
		let view = {};
		view[name] = { map: mapFunc };
		return view;
	}

	public async makeViewsFor(model: any): Promise<Couch.Status> {
		const designDoc = '_design/docs';
		let views = {
			_id: designDoc,
			language: 'javascript',
			views: {}
		};
		for (let prop in model){
			if (model.hasOwnProperty(prop)){
				views.views = Object.assign(views.views, this.makeViewFor(prop));
			}
		}
		const header = await this.headerFor(this.databasePath + designDoc, {body: views});
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
					if (err) reject(err)
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
						let status = {success: resp.body['ok']} as Couch.Status;
						if (resp.body['reason'])
							status.message = resp.body['reason'];
						accept(status);
					}
				}
			);
		});
	}

	public async get(id: string): Promise<T> {
		const header = await this.headerFor(this.databasePath + id);
		return new Promise<T>((accept, reject) => {
			request.get(
				header,
				(err: any, resp: request.RequestResponse, body: any) => {
					if (err) {
						reject(err);
					} else {
						if (resp.body['error']) {
							// TODO Catch it ouside
							reject(new Error(resp.body['reason']));
						} else {
							accept(resp.body);
						}
					}
				}
			);
		});
	}

	public async all(): Promise<T[]> {
		const header = await this.headerFor(this.databasePath + '_all_docs');
		return new Promise<T[]>((accept, reject) => {
			request.get(
				header,
				(err: any, resp: request.RequestResponse, body: any) => {
					if (err) {
						reject(err);
					} else {
						if (resp.body['error']) {
							reject(new Error(resp.body['reason']));
						} else {
							accept(resp.body['rows']);
						}
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
						reject(err)
					} else {
						accept({
							database: this.databaseName,
							exists: resp.body['error'] === undefined,
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
