import ApplicationRouter from './ApplicationRouter';
import Controller from '../controllers/Pet';

export class Pet extends ApplicationRouter {

	controller: Controller;

	constructor() {
		super(new Controller());
	}

	init() {
		this.get('/', this.controller.all);
		this.get('/:_id', this.controller.get);
		this.delete('/:_id', this.controller.delete);
		this.put('/:_id', this.controller.update);
		this.post('/add', this.controller.add);
		this.post_image('/:_id/picture', this.controller.uploadFile);
	}
}

export default new Pet();
