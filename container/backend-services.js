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
		deviceList = ports;
		event.sender.send("refresh-connections-response", {
			success: true,
			deviceList
		});
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

	// Port is already open
	if (port && port.isOpen && port.path === com) {
		console.log("port is already open.."); // write to wake up?
		port.write(wake);
		return false;
	}

	// Create new port
	port = new Serialport(com, {
		baudRate: 9600,
		dataBits: 8,
		parity: "odd",
		stopBits: 1,
		parser: Serialport.parsers.raw
	});

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

	// Flags and initial settings -- reset these at some point?
	let barcodeData = new Uint8Array(),
		getCodesCount = 0;

	// On Port 'error'
	port.on("error", err => {
		console.log(err);
	});

	// On Port 'open'
	port.on("open", err => {
		console.log("opened port!");

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

				// TODO: alert if sufficiently large difference between device and local times? -- alert in app?

				// TODO: RESET CLOCK AND SEE IF CORRECT

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
					event.sender.send(responseName, responseObject);
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
