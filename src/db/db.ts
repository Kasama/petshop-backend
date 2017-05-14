import * as request from 'request';

const url = 'http://localhost:5984';
const dbUser = 'admin';
const dbPass = 'admin';

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
	cookieJar: request.CookieJar;

	constructor(instance: { new(): T }) {
		this.databaseName = instance.name.toLowerCase();
		this.cookieJar = request.jar();
		console.log("empyt jar '" + this.getCookies() + "'");

		console.log("db = '" + this.databaseName + "'");
	}

	public getCookies(): string {
		return this.cookieJar.getCookieString(url);
	}

	public async cleanUp(): Promise<void> {
		if (this.getCookies().length == 0){
			console.log("need to cleanup");
			await this.deauthenticate();
			console.log("Cleaned up");
		}
	}

	private async headerFor(path: string = '', form: any = {}): Promise<request.Options> {
		let ret = { url: url + '/' + path, json: true, jar: this.cookieJar };
		if (this.getCookies().length == 0){
			console.log("need authentication");
			const status = await this.authenticate();
			console.log("authenticated, token: " + this.getCookies());
			console.log("status: " + JSON.stringify(status));
		}
		return Object.assign(ret, form);
	}

	private async authenticate(): Promise<Couch.Status> {
		return new Promise<Couch.Status>((accept, reject) => {
			const header = {
				url: url + '/_session',
				json: true,
				jar: this.cookieJar,
				form: {
					name: dbUser,
					password: dbPass
				}
			} as request.Options;
			request.post(
				header,
				(err: any, resp: request.RequestResponse, body: any) => {
					if (err) {
						reject(err)
					} else {
						if (resp.statusCode == 200 || resp.statusCode == 302){
							accept({success: resp.body['ok']});
						} else {
							accept({success: false, message: resp.body['reason']});
						}
					}
				}
			);
		});
	}

	private async deauthenticate(): Promise<Couch.Status> {
		const header = await this.headerFor('_session');
		return new Promise<Couch.Status>((accept, reject) => {
			request.delete(
				header,
				(err: any, resp: request.RequestResponse, body: any) => {
					if (err) {
						reject(err)
					} else {
						if (resp.statusCode == 200){
							accept({success: resp.body['ok']});
						} else {
							accept({success: false, message: resp.body['reason']});
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

	public async all(): Promise<T> {
		const data: any = {};
		return data;
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
