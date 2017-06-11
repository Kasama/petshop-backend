import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import ClientRouter from './routes/Client';
import AdminRouter from './routes/Admin';
import ProductRouter from './routes/Product';
import ServiceRouter from './routes/Service';
import PetRouter from './routes/Pet';
import EventRouter from './routes/Event';
import LoginRouter from './routes/Login';

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
		this.express.use('/admins', AdminRouter.router);
		this.express.use('/products', ProductRouter.router);
		this.express.use('/services', ServiceRouter.router);
		this.express.use('/pets', PetRouter.router);
		this.express.use('/events', EventRouter.router);
		this.express.use('/login', LoginRouter.router);
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
