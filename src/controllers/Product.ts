import ProductModel from '../models/Product';
import BasicController from './BaseController';

export class Product extends BasicController {
	constructor() {
		super(ProductModel);
	}

	buy() {
		const products_buy = JSON.parse(this.params['products']);
		console.log('=======Trying to buy ', JSON.stringify(products_buy));
		const promises = [] as Promise<ProductModel>[];
		for (const product_id in products_buy) {
			console.log('=======Product: ', product_id);
			const amount = products_buy[product_id];
			promises.push(this.Model.get(product_id));
		}
		Promise.all(promises)
		.then(products => {
			let failed: ProductModel|undefined = undefined;
			// Check if all itens are in stock
			const all_exist = products.every(p => {
				failed = p;
				return p.stock >= products_buy[p._id];
			});
			if (all_exist) {
				// if all itens are in stock, update stock and save
				const save_promises = [];
				products.forEach(product => {
					const amount = products_buy[product._id];
					save_promises.push(product.sell(amount));
				});
				Promise.all(save_promises)
				.then(saves => this.success({success: true}))
				.catch(e => this.fail(new Error('Failed to write products')));
			} else {
				this.success({success: false, product: failed.fullModel()});
			}
		})
		.catch(e => this.fail(new Error('Some products do not exist')));
	}
}

export default Product;
