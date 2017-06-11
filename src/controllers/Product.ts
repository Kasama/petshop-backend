import ProductModel from '../models/Product';
import BasicController from './BaseController';

export class Product extends BasicController {
	constructor() {
		super(ProductModel);
	}

	buy() {
		const products = this.params['products'];
		const promises = [];
		for (const product_id in products) {
			const amount = products[product_id];
			promises.push(this.Model.get(product_id));
		}
	}
}

export default Product;
