import ApplicationRouter from './ApplicationRouter';
import Controller from '../controllers/Client';

export class Client extends ApplicationRouter {

	controller: Controller;

	constructor() {
		super(new Controller());
	}

	init() {
		this.get('/login', this.controller.login);

		this.get('/', this.controller.all);
		this.get('/:_id', this.controller.get);
		this.delete('/:_id', this.controller.delete);
		this.put('/:_id', this.controller.update);
		this.post('/add', this.controller.add);
		this.post_image('/:_id/picture', this.controller.uploadFile);
	}
}

export default new Client();
