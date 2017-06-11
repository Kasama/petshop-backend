import ApplicationModel from './ApplicationModel';

class Product extends ApplicationModel {

	public name: string;
	public description: number;
	public price: number;
	public stock: number;
	public sold: number;
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
			'sold',
		];
	}

	picture_attr(): string {
		return 'picture';
	}

	public async sell(amount): Promise<boolean> {
		this.stock -= amount;
		this.sold += amount;
		return (await this.save()).success;
	}
}

export default Product;
