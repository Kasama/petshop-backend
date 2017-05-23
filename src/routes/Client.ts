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
		this.get('/:_id', this.controller.get);
		this.delete('/:_id', this.controller.delete);
	}
}

export default new Client();
