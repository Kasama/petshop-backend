import {Router, Request, Response, NextFunction} from 'express';

export abstract class ApplicationRouter {
	router: Router;
	controller: any;

	constructor(controller) {
		this.router = Router();
		this.controller = controller;
		this.init();
	}

	abstract init(): void;

	public get(
		path: string,
		handler: (success: (response: any) => void, failure: (error: Error) => void) => void
	) {
		handler = handler.bind(this.controller);
		this.router.get(
			path,
			(req: Request, res: Response, next: NextFunction) => {
				handler(
					(response) => {
						res.send(response);
					},
					(err) => {
						res.send({error: err});
					}
				);
			}
		);
	}

	public post(
		path: string,
		handler: (params: any, success: (response: any) => void, failure: (error: Error) => void) => void
	) {
		handler = handler.bind(this.controller);
		this.router.get(
			path,
			(req: Request, res: Response, next: NextFunction) => {
				handler(
					req.params,
					(response) => {
						res.send(response);
					},
					(err) => {
						res.send({error: err});
					}
				);
			}
		);
	}

	public delete(
		path: string,
		handler: (success: (response: any) => void, failure: (error: Error) => void) => void
	) {
		handler = handler.bind(this.controller);
		this.router.get(
			path,
			(req: Request, res: Response, next: NextFunction) => {
				handler(
					(response) => {
						res.send(response);
					},
					(err) => {
						res.send({error: err});
					}
				);
			}
		);
	}
}

export default ApplicationRouter;
