import {Router, Request, Response, NextFunction} from 'express';
import {ApplicationController} from '../controllers/ApplicationController';

function successResponse(res): (response) => void {
	return (response) => {
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
	return (err) => {
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

	private makeCallbackFor(func: () => void):
		(req: Request, res: Response, next: NextFunction) => void {
		return (req: Request, res: Response, next: NextFunction) => {
			const params = Object.assign(req.params, req.body, req.query);
			this.controller.handle(params, successResponse(res), errorResponse(res), func);
		};
	}

	public get(path: string, func: () => void): void {
		this.router.get(path, this.makeCallbackFor(func));
	}

	public put(path: string, func: () => void): void {
		this.router.put(path, this.makeCallbackFor(func));
	}

	public post(path: string, func: () => void): void {
		this.router.post(path, this.makeCallbackFor(func));
	}

	public delete(path: string, func: () => void): void {
		this.router.delete(path, this.makeCallbackFor(func));
	}
}

export default ApplicationRouter;
