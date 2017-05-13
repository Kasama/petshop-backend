import {Router, Request, Response, NextFunction} from 'express';
import ClientController from '../controllers/ClientController';

export class ClientRouter {
	router: Router;
	controller: ClientController;

	constructor() {
		this.router = Router();
		this.controller = new ClientController();
		this.init();
	}

	public exists(req: Request, res: Response, next: NextFunction) {
		this.controller.exists(
			(answer) => {
				res.send(answer);
			},
			(err) => {
				res.send({error: err.message});
			}
		);
	}

	public createDB(req: Request, res: Response, next: NextFunction) {
		this.controller.createDB(
			(answer) => {
				res.send(answer);
			},
			(err) => {
				res.send({error: err.message});
			}
		);
	}

	public listClients(req: Request, res: Response, next: NextFunction) {
		this.controller.getAllClients(
			(clients) => {
				res.send(clients);
			},
			(err) => {
				res.send({error: err.message});
			}
		);
	}
	public addClient(req: Request, res: Response, next: NextFunction) {
		this.controller.addClient(
			req.params,
			(client) => {
				res.send(client);
			},
			(err) => {
				res.send({error: err.message});
			}
		);
	}

	init() {
		this.router.get('/', this.listClients.bind(this));
		this.router.get('/exists', this.exists.bind(this));
		this.router.get('/create', this.createDB.bind(this));
		this.router.post('/client', this.addClient.bind(this));
	}
}

const clientRoutes = new ClientRouter();
clientRoutes.init();

export default clientRoutes.router;
