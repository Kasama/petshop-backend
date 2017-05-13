import * as request from 'request';

const url = 'http://localhost:5984';

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
		message?: string
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
		this.databasePath = url + '/' + this.databaseName;
		console.log("db = '" + this.databaseName + "'");
	}

	public async getUUID(): Promise<string> {
		return new Promise<string>((accept, reject) => {
			request.get(
				{ url: url + '/_uuids', json: true },
				(err: any, resp: request.RequestResponse, body: any) => {
					if (err) reject(err)
					else accept(resp.body['uuids'][0]);
				}
			);
		});
	}

	public async all(): Promise<T> {
		const data: any = {};
		return data;
	}

	public async exists(): Promise<Couch.Existence> {
		return new Promise<Couch.Existence>((accept, reject) => {
			request.get(
				{ url: this.databasePath, json: true },
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
		return new Promise<Couch.Status>((accept, reject) => {
			request.put(
				{ url: this.databasePath, json: true },
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
