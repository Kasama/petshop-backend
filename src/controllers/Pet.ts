import PetModel from '../models/Pet';
import BasicController from './BaseController';

export class Pet extends BasicController {
	constructor() {
		super(PetModel);
	}
}

export default Pet;
