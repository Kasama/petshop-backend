import {Router, Request, Response, NextFunction} from 'express';
import {ApplicationController} from '../controllers/ApplicationController';

function successResponse(res): (response) => void {
	return function(response) {
		let r = response;
		if (typeof r.map === 'function') {
			r = r.map(one => {
				if (typeof one.normalizedModel === 'function') {
					return one.normalizedModel();
				}
				return one;
			});
		} else {
			if (typeof r.normalizedModel === 'function')
				r = r.normalizedModel();
		}
		res.send(r);
	};
}

function errorResponse(res): (err) => void {
	return function(err) {
		if (err.message)
			res.send({error: err.message});
		else
			res.send({error: err});
	};
}

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
		func: () => void
	) {
		this.router.get(
			path,
			(req: Request, res: Response, next: NextFunction) => {
				const params = Object.assign(req.query, req.params);
				console.log('get params: ' + JSON.stringify(params));
				this.controller.handle(
					params, successResponse(res), errorResponse(res), func
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
					req.body, successResponse(res), errorResponse(res), func
				);
			}
		);
	}

	public delete(
		path: string,
		func: () => void
	) {
		this.router.delete(
			path,
			(req: Request, res: Response, next: NextFunction) => {
				this.controller.handle(
					req.params, successResponse(res), errorResponse(res), func
				);
			}
		);
	}
}

export default ApplicationRouter;
