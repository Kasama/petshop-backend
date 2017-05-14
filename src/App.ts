import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

import ClientRouter from './routes/Client';

class App {
	public express: express.Application;

	constructor(){
		this.express = express();
		this.middleware();
		this.routes();
	}

	private middleware(): void {
		this.express.use(logger('dev'));
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: false }));
	}

	private routes(): void {
		let router = express.Router();

		router.get('/', (req, res, next) => {
			res.json({
				message: 'Hellow!'
			});
		});
		this.express.use('/', router);
		this.express.use('/clients', ClientRouter.router);
	}

	public cleanUp(exitCode: number|null, signal: string|null): void {
		if (!signal) signal = "SIGTERM";

		const suicide = () => {
			process.kill(process.pid, signal);
		}

		ClientRouter.cleanUp()
		.then(suicide.bind(signal)).catch(suicide.bind(signal));
	}
}

export default new App();
