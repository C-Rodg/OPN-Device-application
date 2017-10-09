// Imports
const serialport = require("serialport");
const opnConnect = require("./opn_connect");

serialport.list((err, ports) => {
	if (err) {
		console.log(err);
		return false;
	}
	console.log(ports);
	if (ports.length > 0) {
		let comPort = null;
		for (let i = 0, j = ports.length; i < j; i++) {
			const manufacturer = ports[i].manufacturer
				.replace(/\s/g, "")
				.toUpperCase();
			if (manufacturer.indexOf("OPTOELECTRONICS") > -1) {
				comPort = ports[i].comName;
				break;
			}
		}
		if (comPort) {
			opnConnect.connect(comPort);
		} else {
			// No correct devices found...
		}
	} else {
		// No devices found...
	}
});
