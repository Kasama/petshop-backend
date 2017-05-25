import ProductModel from '../models/Product';
import ApplicationController from './ApplicationController';

export class Product extends ApplicationController {

	static Model = new ProductModel();

	exists(): void {
		Product.Model.dbExists()
		.then(this.success)
		.catch(this.fail);
	}

	createDB(): void {
		Product.Model.createDB()
		.then(this.success)
		.catch(this.fail);
	}

	uploadPicture(): void {
		const id = this.params['_id'];
		const file = this.params['file'];
		Product.Model.uploadFile(id, file)
		.then(this.success)
		.catch(this.fail);
	}

	get(): void {
		Product.Model.get(this.params['_id'])
		.then(this.success)
		.catch(this.fail);
	}

	delete(): void {
		const prom = Product.Model.get(this.params['_id']);
		prom.then(model => {
			model.delete().then(this.success).catch(this.fail);
		});
		prom.catch(this.fail);
	}

	getAll(): void {
		const resp = [];
		const promises: Promise<any>[] = [];
		let all = true;
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
			all = false;
			let params;
			if (this.params[k] instanceof Array)
				params = this.params[k];
			else
				params = [this.params[k]];

			promises.push(Product.Model.find(k, limit, skip, params));
		}
		if (all) promises.push(Product.Model.all(limit, skip));
		Promise.all(promises)
		.then(vals => [ ...new Set([].concat(...vals))])
		.then(this.success)
		.catch(this.fail);
	}

	add(): void {
		let model: ProductModel;
		model = new ProductModel();
		model.update(this.params);
		model.save().then(this.success).catch(this.fail);
	}

	update(): void {
		Product.Model.get(this.params['_id'])
		.then(model => {
			model.update(this.params);
			model.save();
			this.success(model);
		}).catch(this.fail);
	}

}

export default Product;
