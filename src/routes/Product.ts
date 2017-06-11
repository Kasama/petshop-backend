import ApplicationRouter from './ApplicationRouter';
import Controller from '../controllers/Product';

export class Product extends ApplicationRouter {

	controller: Controller;

	constructor() {
		super(new Controller());
	}

	init() {
		this.get('/', this.controller.all);
		this.get('/:_id', this.controller.get);
		this.delete('/:_id', this.controller.delete);
		this.put('/:_id', this.controller.update);
		this.post('/buy', this.controller.buy);
		this.post('/add', this.controller.add);
		this.post_image('/:_id/picture', this.controller.uploadFile);
	}
}

export default new Product();
