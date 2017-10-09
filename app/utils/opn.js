// Imports
const serialport = require("serialport");
const opnConnect = require("./opn_connect");

// Get list of devices and connect -  use one assumed to be OPN-2001 device if no params passed
const startup = () => {
	const app = document.getElementById("app");
	serialport.list((err, ports) => {
		if (err) {
			console.log(err);
			// TODO: Error loading devices
			return false;
		}
		console.log(ports);
		if (ports.length > 0) {
			const deviceList = app.querySelector("#device-list");
			let comPort = null;
			for (let i = 0, j = ports.length; i < j; i++) {
				// Create device info item
				var deviceInfo = document.createElement("p");
				deviceInfo.textContent = `${ports[i].manufacturer} - ${ports[i]
					.comName}`;

				const manufacturer = ports[i].manufacturer
					.replace(/\s/g, "")
					.toUpperCase();
				if (manufacturer.indexOf("OPTOELECTRONICS") > -1) {
					comPort = ports[i].comName;
					deviceInfo.classList.add("active-device");
				}

				deviceList.append(deviceInfo);
			}
			if (comPort) {
				opnConnect.connect(comPort);
			} else {
				// TODO: No correct devices found...
			}
		} else {
			// TODO: No devices found...
		}
	});
};

module.exports.startup = startup;
