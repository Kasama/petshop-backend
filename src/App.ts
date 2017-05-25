import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import ClientRouter from './routes/Client';
import ProductRouter from './routes/Product';

class App {
	public express: express.Application;

	constructor() {
		this.express = express();
		this.middleware();
		this.routes();
	}

	private middleware(): void {
		this.express.use(cors());
		this.express.use(logger('dev'));
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: false }));
	}

	private routes(): void {
		const router = express.Router();

		this.express.use('/', express.static(__dirname + '/public'));
		this.express.use('/clients', ClientRouter.router);
		this.express.use('/products', ProductRouter.router);
	}

	public cleanUp(exitCode: number|null, signal: string|null): void {
		if (!signal) signal = 'SIGTERM';

		const suicide = () => {
			process.kill(process.pid, signal);
		};

		suicide();
	}
}

export default new App();
