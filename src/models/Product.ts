import ApplicationModel from './ApplicationModel';

class Product extends ApplicationModel {

	public name: string;
	public description: number;
	public price: number;
	public stock: number;
	public picture: string;

	constructor(base?: any) {
		super(Product, base);
	}

	fields(): string[] {
		return [
			'name',
			'description',
			'price',
			'stock',
		];
	}

	picture_attr(): string {
		return 'picture';
	}
}

export default Product;
