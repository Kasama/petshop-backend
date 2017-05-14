import {Router, Request, Response, NextFunction} from 'express';
import {ApplicationController} from '../controllers/ApplicationController';

export abstract class ApplicationRouter {
	router: Router;
	controller: ApplicationController;

	constructor(controller) {
		this.router = Router();
		this.controller = controller;
		this.init();
	}

	abstract init(): void;

	public get(
		path: string,
		handler: string
	) {
		this.router.get(
			path,
			(req: Request, res: Response, next: NextFunction) => {
				this.controller.handle(
					req.params,
					(response) => {
						res.send(response);
					},
					(err) => {
						res.send({error: err});
					},
					handler
				);
			}
		);
	}

	public post(
		path: string,
		handler: string
	) {
		this.router.get(
			path,
			(req: Request, res: Response, next: NextFunction) => {
				this.controller.handle(
					req.params,
					(response) => {
						res.send(response);
					},
					(err) => {
						res.send({error: err});
					},
					handler
				);
			}
		);
	}

	public delete(
		path: string,
		handler: string
	) {
		this.router.get(
			path,
			(req: Request, res: Response, next: NextFunction) => {
				this.controller.handle(
					req.params,
					(response) => {
						res.send(response);
					},
					(err) => {
						res.send({error: err});
					},
					handler
				);
			}
		);
	}
}

export default ApplicationRouter;
