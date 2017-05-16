export abstract class ApplicationController {

	params: any;
	success: (answer: any) => void;
	fail: (err: Error) => void;

	handle(
		params: any,
		success: (answer: any) => void,
		fail: (err: Error) => void,
		func: () => void
	): void {
		// This may smell a bit, but it's
		// for the greater good
		func.bind({
			params: params,
			success: success,
			fail: fail,
			self: this
		})();
	}

	/*
	hasMethod(name: string): boolean {
		if (typeof this[name] == 'function')
			return true
		else
			return false
	}
	*/
}

export default ApplicationController;
