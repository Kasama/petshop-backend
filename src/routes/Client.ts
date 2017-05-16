import ApplicationRouter from './ApplicationRouter';
import Controller from '../controllers/Client';

export class Client extends ApplicationRouter {

	controller: Controller;

	constructor() {
		super(new Controller());
	}

	init() {
		this.get('/', this.controller.getAll);
		this.get('/create', this.controller.createDB);
		this.get('/exists', this.controller.exists);
		this.post('/add', this.controller.add);
		this.get('/:id', this.controller.get);
	}
}

export default new Client();
