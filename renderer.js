// Imports
const serialport = require("serialport");
const opnUtils = require("./scripts/opn_utils");

// Create port -- HARDCODED COM4  TODO:
const port = new serialport("COM4", {
	baudRate: 9600,
	dataBits: 8,
	parity: "odd",
	stopBits: 1,
	parser: serialport.parsers.raw
});

// Flags and initial settings
let checkOnce = false,
	barcodeData = new ArrayBuffer(),
	getCodesCount = 0;

port.on("open", err => {
	if (err) {
		return console.log("ERROR:", err.message);
	}
	console.log("PORT IS OPEN");

	port.on("data", data => {
		console.log(data);
		const offset = parseInt(data[data.length - 3]);

		if (data.length === 12 && offset === 0) {
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
			console.log(`Device Time: ${deviceTime.toJSON()}`);
			console.log(`Current Time: ${now.toJSON()}`);

			// Determine difference
			const diff = now.getTime() - deviceTime.getTime();
			const secondsBetweenDates = Math.abs(diff / 1000);
			console.log(`Clock drift: ${secondsBetweenDates}`);

			// TODO: alert if sufficiently large difference between device and local times?

			// TODO: RESET CLOCK AND SEE IF CORRECT

			// Get barcodes
			port.write(getCodes);
		} else if (data.length === 23 && offset === 0) {
			console.log("DATA -- Device wake");
			const serial = data.slice(4, 12);
			const sw_ver = data.slice(12, 20);
			console.log(`Device: ${serial.toString("hex")}`);
			console.log(`Firmware: ${sw_ver.toString()}`);
			if (!checkOnce) {
				port.write(clock);
				checkOnce = true;
			}
		} else if (data.length === 5 && offset === 0) {
			console.log("DATA -- Clear/Powered Down");
		} else {
			console.log("DATA -- Received barcode data...");
			barcodeData = opnUtils._appendBuffer(barcodeData, data);

			if (offset === 0) {
				console.log(
					"All barcode data received. Length: ",
					barcodeData.byteLength
				);

				// Get Barcodes buffer
				let codes = data.slice(10, -3);

				let length = null,
					first = null,
					scan = null,
					symbology = null,
					batchCount = 0,
					detectedScans = [];

				while (codes) {
					length = parseInt(codes[0]);
					first = new ArrayBuffer(length);
					first = codes.slice(1, length + 1);
					data = codes.slice(length + 1);

					if (first.byteLength !== 0) {
						codes = codes.slice(length + 1);
						batchCount += 1;

						// TODO: SYMBOLOGY IMPORT
						symbology = opnUtils.symbologies[first[0]];
						scan = first.slice(1, first.length - 4).toString();
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

				if (batchCount > 0) {
					console.log(`Barcodes: ${JSON.stringify(detectedScans)}`);
				} else if (getCodesCount < 50) {
					getCodesCount += 1;
					port.write(getCodes);
				} else {
					console.log("No barcodes to read..");
				}
			}
		}
	});

	// Basic commands
	const wake = new Buffer([0x01, 0x02, 0x00, 0x9f, 0xde]); // Wake up device
	const clock = new Buffer([0x0a, 0x02, 0x00, 0x5d, 0xaf]); // Check clock drift
	const getCodes = new Buffer([0x07, 0x02, 0x00, 0x9e, 0x3e]); // Get Barcodes
	const clearCodes = new Buffer([0x02, 0x02, 0x00, 0x9f, 0x2e]); // Clear existing codes
	const powerDown = new Buffer([0x05, 0x02, 0x00, 0x5e, 0x9f]); // Shut the device down

	port.write(wake);
});
