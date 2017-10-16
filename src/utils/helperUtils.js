// Determine if device is a quickscan
export const isQuickscan = device => {
	if (device.manufacturer) {
		const name = device.manufacturer.replace(/\s/g, "").toUpperCase();
		if (name.indexOf("OPTOELECTRONICS") > -1) {
			return true;
		}
	}
	return false;
};
