import {Router, Request, Response, NextFunction} from 'express';
import {ApplicationController} from '../controllers/ApplicationController';
import * as Multer from 'multer';

const tmpImagePath = 'tmpFiles/';

const imageUpload = Multer({
	dest: tmpImagePath,
	fileFilter: imageFileFilter
}).single('image');

function imageFileFilter(
	req: Express.Request, file: Express.Multer.File,
	cb: (error: Error, acceptFile: boolean) => void
) {
	console.log('==== Filtering image====');
	console.log('file ' + JSON.stringify(file));
	console.log('file is ' + file.originalname);
	if (!file.originalname.match(/\.(jpe?g|png|gif)$/))
		cb(new Error('Image files only'), false);
	else cb(undefined, true);
}

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
			if (req.file) params['file'] = req.file;
			this.controller.handle(params, successResponse(res), errorResponse(res), func);
		};
	}

	public post_image(path: string, func: () => void): void {
		this.router.post(path, imageUpload, this.makeCallbackFor(func));
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
