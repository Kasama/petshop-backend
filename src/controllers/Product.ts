import ProductModel from '../models/Product';
import BasicController from './BaseController';

export class Product extends BasicController {
	constructor() {
		super(ProductModel);
	}
}

export default Product;
