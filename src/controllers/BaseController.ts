import ApplicationModel from '../models/ApplicationModel';
import ApplicationController from './ApplicationController';

export abstract class BaseController extends ApplicationController {

	protected ModelConstructor: { new(base?: any): any };
	protected Model: ApplicationModel;

	constructor(modelKlass: { new(base?: any): ApplicationModel }) {
		super();
		this.ModelConstructor = modelKlass;
		this.Model = new this.ModelConstructor();
	}

	exists(): void {
		this.Model.dbExists()
		.then(this.success)
		.catch(this.fail);
	}

	createDB(): void {
		this.Model.createDB()
		.then(this.success)
		.catch(this.fail);
	}

	uploadFile(): void {
		const id = this.params['_id'];
		const file = this.params['file'];
		this.Model.uploadFile(id, file)
		.then(this.success)
		.catch(this.fail);
	}

	get(): void {
		this.Model.get(this.params['_id'])
		.then(this.success)
		.catch(this.fail);
	}

	delete(): void {
		const prom = this.Model.get(this.params['_id']);
		prom.then(model => {
			model.delete().then(this.success).catch(this.fail);
		});
		prom.catch(this.fail);
	}

	all(): void {
		const resp = [];
		const promises: Promise<any>[] = [];
		let everyone = true;
		let limit = undefined;
		let skip = undefined;
		if (this.params['limit']) {
			if (this.params['limit'][0])
				limit = parseInt(this.params['limit'][0]);
			else limit = parseInt(this.params['limit']);
			delete this.params['limit'];
		}
		if (this.params['skip']) {
			if (this.params['skip'][0])
				skip = parseInt(this.params['skip'][0]);
			else skip = parseInt(this.params['skip']);
			delete this.params['skip'];
		}
		for (const k in this.params) {
			everyone = false;
			let params;
			if (this.params[k] instanceof Array)
				params = this.params[k];
			else
				params = [this.params[k]];

			promises.push(this.Model.find(k, limit, skip, params));
		}
		if (everyone) {
			promises.push(this.Model.all(limit, skip));
		}
		Promise.all(promises)
		.then(vals => [ ...new Set([].concat(...vals))])
		.then(this.success)
		.catch(this.fail);
	}

	add(): void {
		let model: ApplicationModel;
		model = new this.ModelConstructor(this.params);
		model.save().then(this.success).catch(this.fail);
	}

	update(): void {
		this.Model.get(this.params['_id'])
		.then(model => {
			model.update(this.params);
			model.save();
			this.success(model);
		}).catch(this.fail);
	}

}

export default BaseController;
