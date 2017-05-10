import {Router, Request, Response, NextFunction} from 'express';
import {ClientController} from '../controllers/ClientController';

export class ClientRouter {
	router: Router;
	controller: ClientController;

	constructor() {
		this.router = Router();
		this.controller = new ClientController();
		this.init();
	}

	public listClients(req: Request, res: Response, next: NextFunction) {
		this.controller.getAllClients((clients) => {
			res.send(clients);
		});
	}

	init() {
		this.router.get('/', this.listClients);
	}
}

const clientRoutes = new ClientRouter();
clientRoutes.init();

export default clientRoutes.router;
