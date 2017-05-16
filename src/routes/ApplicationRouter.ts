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

	public safetyCheck(method: string) {
		if (!this.controller.hasMethod(method))
			throw new Error("Method '" + method + "' does not exist in controller");
	}

	public get(
		path: string,
		func: () => void
	) {
		this.router.get(
			path,
			(req: Request, res: Response, next: NextFunction) => {
				console.log("got query: " + JSON.stringify(req.query));
				console.log("got params: " + JSON.stringify(req.params));
				this.controller.handle(
					Object.assign(req.query, req.params),
					(response) => {
						res.send(response);
					},
					(err) => {
						res.send({error: err});
					},
					func
				);
			}
		);
	}

	public post(
		path: string,
		func: () => void
	) {
		this.router.post(
			path,
			(req: Request, res: Response, next: NextFunction) => {
				this.controller.handle(
					req.body,
					(response) => {
						res.send(response);
					},
					(err) => {
						res.send({error: err});
					},
					func
				);
			}
		);
	}

	public delete(
		path: string,
		func: () => void
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
					func
				);
			}
		);
	}
}

export default ApplicationRouter;
