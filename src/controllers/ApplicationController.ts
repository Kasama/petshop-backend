export abstract class ApplicationController {

	params: any;
	success: (answer: any) => void;
	fail: (err: Error) => void;

	handle(
		params: any,
		success: (answer: any) => void,
		fail: (err: Error) => void,
		func: string
	): void {
		// This may smell a bit, but its
		// for the greater good
		this[func].bind({
			params: params,
			success: success,
			fail: fail,
			self: this
		})();
	}
}

export default ApplicationController;
