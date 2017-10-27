const electron = require("electron");
const { ipcMain } = electron;
const Serialport = require("serialport");
const opnUtils = require("./opn-utils");

let port = null,
	deviceList = null;

// EVENT - bootup application
ipcMain.on("bootup-application", (event, arg) => {
	// List all connected devices
	Serialport.list((err, ports) => {
		// Unable to get serial ports
		if (err || !ports) {
			event.sender.send(
				"bootup-application-response",
				generateError("Unable to get serialport devices..")
			);
			return false;
		}

		// Connect to first OPN device
		let selectedPort;
		for (let i = 0, j = ports.length; i < j; i++) {
			if (
				ports[i].manufacturer &&
				ports[i].manufacturer
					.replace(/\s/g, "")
					.toUpperCase()
					.indexOf("OPTOELECTRONICS") > -1
			) {
				selectedPort = ports[i];
				break;
			}
		}
		// No OPN devices found
		if (!selectedPort) {
			event.sender.send(
				"bootup-application-response",
				generateError("No opticon devices found..")
			);
			return false;
		}

		// Get Device Info
		deviceList = ports;
		getDeviceInfo(selectedPort.comName, event, "bootup-application-response");
	});
});

// EVENT - close-connection
ipcMain.on("close-connection", (event, arg) => {
	if (port && port.isOpen) {
		port.close(err => {
			if (err) {
				event.sender.send("close-connection-response", generateError(err));
				return false;
			}
			port = null;
			event.sender.send("close-connection-response", { success: true });
		});
	} else {
		port = null;
		event.sender.send("close-connection-response", { success: true });
	}
});

// EVENT - create-connection
ipcMain.on("create-connection", (event, arg) => {
	getDeviceInfo(arg.comName, event, "create-connection-response");
});

// EVENT - refresh devices
ipcMain.on("refresh-connections", (event, arg) => {
	// List all connected devices
	Serialport.list((err, ports) => {
		// Unable to get serial ports
		if (err || !ports) {
			event.sender.send(
				"refresh-connections-response",
				generateError("Unable to get serialport devices..")
			);
			return false;
		}
		// Get Device Info
		console.log("Refreshed devices");
		deviceList = ports;
		event.sender.send("refresh-connections-response", {
			success: true,
			deviceList
		});
	});
});

// EVENT - clear device
ipcMain.on("clear-device", (event, arg) => {
	// Basic commands
	const wake = new Buffer([0x01, 0x02, 0x00, 0x9f, 0xde]); // Wake up device
	const clearCodes = new Buffer([0x02, 0x02, 0x00, 0x9f, 0x2e]); // Clear existing codes

	// Create new port
	port = new Serialport(arg.comName, {
		baudRate: 9600,
		dataBits: 8,
		parity: "odd",
		stopBits: 1,
		parser: Serialport.parsers.raw
	});

	// On Port 'error'
	port.on("error", err => {
		console.log(err);
	});

	// On Port 'open'
	port.on("open", err => {
		console.log("PORT OPENED - for clearing");

		if (err) {
			console.log(err.message);
			event.sender.send("clear-device-response", generateError(err.message));
		}

		// On Port 'data'
		port.on("data", data => {
			const offset = parseInt(data[data.length - 3]);

			if (data.length === 23 && offset === 0) {
				// Handle Wake command
				console.log("DATA -- Device awake for clearing");
				// Clear device
				port.write(clearCodes);
			} else if (data.length === 5 && offset === 0) {
				// Handle Clear Data command
				console.log("DATA -- Clear/Powered Down");

				if (port && port.isOpen) {
					port.close(err => {
						if (err) {
							event.sender.send("clear-device-response", generateError(err));
							return false;
						}
						console.log("DATA CLEARED - PORT CLOSED");
						port = null;
						event.sender.send("clear-device-response", {
							success: true,
							barcodes: []
						});
					});
				} else {
					port = null;
					event.sender.send("clear-device-response", {
						success: true,
						barcodes: []
					});
				}
			} else {
				// Other command called..?
				console.log("DATA -- Other command - should not be called.");
			}
		});

		port.write(wake);
	});
});

// Reset device time
ipcMain.on("reset-time", (event, arg) => {
	// Basic commands
	const wake = new Buffer([0x01, 0x02, 0x00, 0x9f, 0xde]); // Wake up device - 1,2,0,159,222
	const clock = new Buffer([0x0a, 0x02, 0x00, 0x5d, 0xaf]); // Get Time - 10,2,0,93,175

	const setTime = new Buffer([0x05, 0x02, 0x00, 0x9e, 0x5e, 0x9f]); // 5, 2, 0, 158, 94, 159
	// set clock: "\t\x02\x06'\x12\x11\x12\x07\x10\x00"   '\x97\xd7'
	// horizontal tab, start of text, acknowledge + dates + null byte

	//const otherSetTime = new Buffer([0x09, 0x02, 0x06, DATE HERE , 0x00])
	const otherSetTime = new Buffer([
		0x09, // correct
		0x02, // correct
		0x06, // correct
		0x07, // 7, 7, 7, 7
		0x07,
		0x07,
		0x07,
		0x00 // correct
	]);
	// Create new port
	port = new Serialport(arg.comName, {
		baudRate: 9600,
		dataBits: 8,
		parity: "odd",
		stopBits: 1,
		parser: Serialport.parsers.raw
	});

	// On Port 'error'
	port.on("error", err => {
		console.log(err);
	});

	// Time object to return
	const responseObject = {
		time: {
			deviceTime: "",
			currentTime: "",
			clockDrift: ""
		}
	};

	port.on("open", err => {
		console.log("PORT OPENED - for time reset");

		if (err) {
			console.log(err.message);
			event.sender.send("reset-time-response", generateError(err.message));
		}

		// On Port 'data'
		port.on("data", data => {
			const offset = parseInt(data[data.length - 3]);
			console.log(`Data is: ${data.length}, offset is: ${offset}`);
			if (data.length === 23 && offset === 0) {
				// Handle Wake command
				console.log("DATA -- Device wake for time reset");

				// Set Time Info
				const now = new Date();
				const year = now.getFullYear() - 2000;
				const month = now.getMonth() + 1;
				const day = now.getDate();
				const hr = now.getHours();
				const mins = now.getMinutes();
				const secs = now.getSeconds();
				const nowArr = [secs, mins, hr, day, month, year];
				console.log(nowArr);
				// const uArr = new Uint8Array(6);
				// uArr[0] = secs;
				// uArr[1] = mins;
				// uArr[2] = hr;
				// uArr[3] = day;
				// uArr[4] = month;
				// uArr[5] = year;
				const uArr = new Uint8Array(10);
				uArr[0] = 0x09;
				uArr[1] = 0x02;
				uArr[2] = 0x06;
				uArr[3] = secs;
				uArr[4] = mins;
				uArr[5] = hr;
				uArr[6] = day;
				uArr[7] = month;
				uArr[8] = year;
				uArr[9] = 0x00;
				console.log(uArr);
				const resetTime = new Buffer(uArr);
				port.write(otherSetTime);
			} else if (data.length === 12 && offset === 0) {
				// Handle Get Time
				console.log("DATA -- Get Time");

				// Get all parts of the date
				let s = data.slice(3, 4).toString();
				s = s.codePointAt(0);
				let min = data.slice(4, 5).toString();
				min = min.codePointAt(0);
				let hr = data.slice(5, 6).toString();
				hr = hr.codePointAt(0);
				let day = data.slice(6, 7).toString();
				day = day.codePointAt(0);
				let month = data.slice(7, 8).toString();
				month = month.codePointAt(0);
				let yr = data.slice(8, 9).toString();
				yr = yr.codePointAt(0);
				yr += 2000;

				// Get current time vs. device time
				const now = new Date();
				const deviceTime = new Date(yr, month - 1, day, hr, min, s);

				// Determine difference
				const diff = now.getTime() - deviceTime.getTime();
				const secondsBetweenDates = Math.abs(diff / 1000);

				// Assign time values to response object
				responseObject.time.clockDrift = secondsBetweenDates;
				responseObject.time.currentTime = now.toJSON();
				responseObject.time.deviceTime = now.toJSON();

				// Get barcodes
				port.write(getCodes);
			} else {
				console.log("DATA -- Other command - should not be called");
			}
		});

		port.write(wake);
	});
});

// Connect to device and respond to renderer
const getDeviceInfo = (com, event, responseName) => {
	// Basic commands
	const wake = new Buffer([0x01, 0x02, 0x00, 0x9f, 0xde]); // Wake up device
	const clock = new Buffer([0x0a, 0x02, 0x00, 0x5d, 0xaf]); // Check clock drift
	const getCodes = new Buffer([0x07, 0x02, 0x00, 0x9e, 0x3e]); // Get Barcodes
	const clearCodes = new Buffer([0x02, 0x02, 0x00, 0x9f, 0x2e]); // Clear existing codes
	const powerDown = new Buffer([0x05, 0x02, 0x00, 0x5e, 0x9f]); // Shut the device down

	if (port && port.isOpen && port.comName === com) {
		console.log("PORT IS ALREADY OPEN!!");
	} else {
		console.log("NEW PORT CREATED");
		// Create new port
		port = new Serialport(com, {
			baudRate: 9600,
			dataBits: 8,
			parity: "odd",
			stopBits: 1,
			parser: Serialport.parsers.raw
		});
	}

	// Object to return to renderer
	const responseObject = {
		devices: {
			currentPort: com,
			deviceList: deviceList
		},
		info: {
			device: "",
			firmware: ""
		},
		time: {
			deviceTime: "",
			currentTime: "",
			clockDrift: ""
		},
		barcodes: []
	};

	// Barcode Data Typed Array
	let barcodeData = new Uint8Array();

	// On Port 'error'
	port.on("error", err => {
		console.log(err);
	});

	// On Port 'open'
	port.on("open", err => {
		console.log("PORT OPENED - for device info");

		if (err) {
			console.log(err.message);
			event.sender.send(responseName, generateError(err.message));
		}

		// On Port 'data'
		port.on("data", data => {
			const offset = parseInt(data[data.length - 3]);

			if (data.length === 12 && offset === 0) {
				// Handle Time Check command
				console.log("DATA -- Time offset");

				// Get all parts of the date
				let s = data.slice(3, 4).toString();
				s = s.codePointAt(0);
				let min = data.slice(4, 5).toString();
				min = min.codePointAt(0);
				let hr = data.slice(5, 6).toString();
				hr = hr.codePointAt(0);
				let day = data.slice(6, 7).toString();
				day = day.codePointAt(0);
				let month = data.slice(7, 8).toString();
				month = month.codePointAt(0);
				let yr = data.slice(8, 9).toString();
				yr = yr.codePointAt(0);
				yr += 2000;

				// Get current time vs. device time
				const now = new Date();
				const deviceTime = new Date(yr, month - 1, day, hr, min, s);

				// Determine difference
				const diff = now.getTime() - deviceTime.getTime();
				const secondsBetweenDates = Math.abs(diff / 1000);

				// Assign time values to response object
				responseObject.time.clockDrift = secondsBetweenDates;
				responseObject.time.currentTime = now.toJSON();
				responseObject.time.deviceTime = now.toJSON();

				// Get barcodes
				port.write(getCodes);
			} else if (data.length === 23 && offset === 0) {
				// Handle Wake command
				console.log("DATA -- Device wake");

				// Assign device serial number and firmware version
				const serial = data.slice(4, 12);
				const sw_ver = data.slice(12, 20);
				responseObject.info.device = `${serial.toString("hex")}`;
				responseObject.info.firmware = `${sw_ver.toString()}`;

				// Get Clock info
				port.write(clock);
			} else if (data.length === 5 && offset === 0) {
				// Handle Clear Data command
				console.log("DATA -- Clear/Powered Down");
			} else {
				console.log("DATA -- Get Barcodes");
				// Append barcode data
				barcodeData = opnUtils._appendBuffer(barcodeData, data);
				if (offset === 0) {
					// Strip off prefix & postfix
					let codes = barcodeData.slice(10, -3);

					let length = null,
						first = null,
						scan = null,
						symbology = null,
						detectedScans = [];

					while (codes) {
						length = parseInt(codes[0]);
						first = codes.slice(1, length + 1);
						barcodeData = codes.slice(length + 1);
						if (first.byteLength !== 0) {
							codes = codes.slice(length + 1);
							symbology = opnUtils.symbologies[first[0] || "UNKNOWN"];
							// Convert scan from Uint8Array to normal array then map to characters
							scan = Array.from(first.slice(1, first.length - 4))
								.map(x => String.fromCharCode(x))
								.join("");
							const scanDateTime = opnUtils.extractPackedTimestamp(
								first[first.length - 1],
								first[first.length - 2],
								first[first.length - 3],
								first[first.length - 4]
							);
							detectedScans.push({
								type: symbology,
								data: scan,
								time: scanDateTime
							});
						} else {
							codes = false;
						}
					}
					responseObject.barcodes = detectedScans;
					if (port && port.isOpen) {
						port.close(err => {
							if (err) {
								event.sender.send(responseName, generateError(err));
								return false;
							}
							console.log("GOT DEVICE INFO - PORT CLOSED");
							port = null;
							event.sender.send(responseName, responseObject);
						});
					} else {
						port = null;
						event.sender.send(responseName, responseObject);
					}
				}
			}
		});

		// Kick off actions
		port.write(wake);
	});
};

// HELPER - Generate Error object
const generateError = msg => {
	return {
		error: true,
		message: msg
	};
};
