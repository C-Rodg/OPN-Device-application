const electron = require("electron");
const { ipcMain } = electron;
const Serialport = require("serialport");

let currentConnection = null,
	currentPort = null,
	deviceList = null;

// Bootup application, list ports, create connection, return back current connection and device list
ipcMain.on("bootup-application", (event, arg) => {
	Serialport.list((err, ports) => {
		if (err) {
			event.sender.send("bootup-application-response", {
				error: true,
				message: "Unable to get serialport devices.."
			});
			return false;
		}
		let port;
		for (let i = 0, j = ports.length; i < j; i++) {
			if (
				ports[i].manufacturer &&
				ports[i].manufacturer
					.replace(/\s/g, "")
					.toUpperCase()
					.indexOf("OPTOELECTRONICS") > -1
			) {
				port = ports[i];
				break;
			}
		}
		if (!port) {
			event.sender.send("bootup-application-response", {
				error: true,
				message: "No opticon devices found.."
			});
			return false;
		}

		// Set Globals
		deviceList = ports;
		currentPort = port;
		currentConnection = new Serialport(port.comName, {
			baudRate: 9600,
			dataBits: 8,
			parity: "odd",
			stopBits: 1,
			parser: Serialport.parsers.raw
		});

		// Send response
		const returnObj = {
			currentDevice: port,
			deviceList: ports
		};
		event.sender.send("bootup-application-response", returnObj);
	});
});

// Close the current connection
ipcMain.on("close-connection", (event, arg) => {
	if (currentConnection && currentConnection.isOpen) {
		currentConnection.close(err => {
			console.log("CLOSED!");
			if (err) {
				console.log(err);
				event.sender.send("close-connection-response", {
					error: true,
					message: "Unable to close connection.."
				});
				return false;
			}
			currentConnection = null;
			event.sender.send("close-connection-response", { success: true });
		});
	} else {
		currentConnection = null;
		event.sender.send("close-connection-response", { success: true });
	}
});

// Create a current connection
ipcMain.on("create-connection", (event, arg) => {
	console.log(arg);
	if (
		currentConnection &&
		currentConnection.isOpen &&
		currentConnection.path === arg.comName
	) {
		// This port is already open, return success true
		event.sender.send("create-connection-response", {
			success: true,
			deviceList,
			currentDevice: currentPort
		});
		return false;
	}
	// Determine if exists in current device list
	let inDeviceList = false;
	for (let i = 0, j = deviceList.length; i < j; i++) {
		if (deviceList[i].comName === arg.comName) {
			currentPort = deviceList[i];
			inDeviceList = true;
			break;
		}
	}

	// If in current device list
	if (inDeviceList) {
		currentConnection = new Serialport(arg.comName, {
			baudRate: 9600,
			dataBits: 8,
			parity: "odd",
			stopBits: 1,
			parser: Serialport.parsers.raw
		});

		const returnObj = { success: true, deviceList, currentDevice: currentPort };
		event.sender.send("create-connection-response", returnObj);
		return false;
	} else {
		Serialport.list((err, ports) => {
			if (err) {
				event.sender.send("create-connection-response", {
					error: true,
					message: "Unable to get serialport devices.."
				});
				return false;
			}
			deviceList = ports;
			let port;
			for (let i = 0, j = ports.length; i < j; i++) {
				if (ports[i].comName === arg.comName) {
					port = ports[i];
					currentPort = port;
					break;
				}
			}
			if (port) {
				currentConnection = new Serialport(arg.comName, {
					baudRate: 9600,
					dataBits: 8,
					parity: "odd",
					stopBits: 1,
					parser: Serialport.parsers.raw
				});
				const returnObj = {
					success: true,
					deviceList,
					currentDevice: port
				};
				event.sender.send("create-connection-response", returnObj);
				return false;
			} else {
				event.sender.send("create-connection-response", {
					error: true,
					message: "No matching port found..."
				});
				return false;
			}
		});
	}
});

// Get serialport device list
ipcMain.on("get-devices", (event, arg) => {
	Serialport.list((err, ports) => {
		if (err) {
			event.sender.send("get-devices-response", {
				error: true,
				message: "Unable to get serialport devices."
			});
			return false;
		}
		event.sender.send("get-devices-response", ports);
	});
});

// Connect to a device
ipcMain.on("connect-device", (event, arg) => {
	console.log(arg);
	if (
		currentConnection &&
		currentConnection.isOpen &&
		currentConnection.path === arg
	) {
		console.log("this port is already opened...");
		console.log(currentConnection);
		event.sender.send("connect-device-response", { success: true });
	} else {
		console.log("opening a new port");
		currentConnection = new Serialport(arg, {
			baudRate: 9600,
			dataBits: 8,
			parity: "odd",
			stopBits: 1,
			parser: Serialport.parsers.raw
		});
		event.sender.send("connect-device-response", { success: true });
	}
	return false;
});

// On Disconnect -- not sure if this a real function..
ipcMain.on("disconnect-device", (event, arg) => {
	Serialport.close();
});
