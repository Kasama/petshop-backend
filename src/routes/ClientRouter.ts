import {Router, Request, Response, NextFunction} from 'express';
import {ClientController} from '../controllers/ClientController';

export class ClientRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	public listClients(req: Request, res: Response, next: NextFunction) {
		res.send({clients: [{'name': 'jose', 'age': 30}]});
	}

	init() {
		this.router.get('/', this.listClients);
	}
}

const clientRoutes = new ClientRouter();
clientRoutes.init();

export default clientRoutes.router;
