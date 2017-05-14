import Model from '../models/Client';

export class Client {

	params: any;
	success: (answer: any) => void;
	fail: (err: Error) => void;

	async cleanUp(): Promise<void> {
		return Model.cleanUp();
	}

	doSomething(
		params: any,
		success: (answer: any) => void,
		fail: (err: Error) => void,
		something: string
	): void {
		this[something].bind({params: params, success: success, fail: fail});
	}

	exists(
		success: (answer: any) => void,
		fail: (err: Error) => void
	): void{
		Model.dbExists()
		.then(success)
		.catch(fail);
	}

	createDB(
		success: (answer: any) => void,
		fail: (err: Error) => void
	): void {
		Model.createDB()
		.then(success)
		.catch(fail);
	}

	getAll(s, f): void {
		// this.doSomething(...args, Model.all);
	}

	add(p, s, f): void {
		// this.doSomething(...args, Model.add);
	}
}

export default Client;
