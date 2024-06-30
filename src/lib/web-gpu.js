// todo: use it
export const getGpuDevice = async () => {
	try {
		const adapter = await navigator.gpu?.requestAdapter();
		const device = await adapter?.requestDevice();
		if (!device) {
			console.error('need a browser that supports WebGPU!');
			return;
		}

		return device;
	} catch (e) {
		console.error(e);
	}
};
