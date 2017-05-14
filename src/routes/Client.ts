import ApplicationRouter from './ApplicationRouter';
import Controller from '../controllers/Client';

export class Client extends ApplicationRouter {

	controller: Controller;

	constructor() {
		super(new Controller());
	}

	init() {
		this.get('/', 'getAll');
		this.get('/create', 'createDB');
		this.get('/exists', 'exists');
		this.post('/add', 'add');
	}
}

export default new Client();
