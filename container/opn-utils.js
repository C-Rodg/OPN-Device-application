// Constructor for calculating symbol's CRC check
function SymbolCrc16() {
	this.crcTable = [];
	const poly = 0xa001;
	for (let byteIndex = 0; byteIndex < 256; byteIndex++) {
		let crc = 0;
		let byteNum = byteIndex;

		for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
			if (((byteNum ^ crc) & 1) > 0) {
				crc = (crc >> 1) ^ poly;
			} else {
				crc = crc >> 1;
			}
			byteNum = byteNum >> 1;
		}
		this.crcTable[byteIndex] = crc;
	}
}

// Method for calculating HiByte & LoByte CRC checks
SymbolCrc16.prototype.CalcSymbolCrc16 = function(
	bytesToCheck,
	numBytesToCheck
) {
	let calcValue = 0xffff;

	for (let byteIndex = 0; byteIndex < numBytesToCheck; byteIndex++) {
		calcValue =
			this.crcTable[bytesToCheck[byteIndex] ^ (calcValue & 0xff)] ^
			(calcValue >> 8);
	}
	calcValue = ~calcValue;

	return {
		HiByte: (calcValue & 0xff00) >> 8,
		LoByte: calcValue & 0xff
	};
};

// Mapping of OPN symbologies
const symbologies = {
	0x16: "Bookland",
	0x0e: "MSI",
	0x02: "Codabar",
	0x11: "PDF-417",
	0x0c: "Code 11",
	0x26: "Postbar (Canada)",
	0x20: "Code 32",
	0x1e: "Postnet (US)",
	0x03: "Code 128",
	0x23: "Postal (Australia)",
	0x01: "Code 39",
	0x22: "Postal (Japan)",
	0x13: "Code 39 Full ASCII",
	0x27: "Postal (UK)",
	0x07: "Code 93",
	0x1c: "QR code",
	0x1d: "Composite",
	0x31: "RSS limited",
	0x17: "Coupon",
	0x30: "RSS-14",
	0x04: "D25",
	0x32: "RSS Expanded",
	0x1b: "Data Matrix",
	0x24: "Signature",
	0x0f: "EAN-128",
	0x15: "Trioptic Code 39",
	0x0b: "EAN-13",
	0x08: "UPCA",
	0x4b: "EAN-13+2",
	0x48: "UPCA+2",
	0x8b: "EAN-13+5",
	0x88: "UPCA+5",
	0x0a: "EAN-8",
	0x09: "UPCE",
	0x4a: "EAN-8+2",
	0x49: "UPCE+2",
	0x8a: "EAN-8+5",
	0x89: "UPCE+5",
	0x05: "IATA",
	0x10: "UPCE1",
	0x19: "ISBT-128",
	0x50: "UPCE1+2",
	0x21: "ISBT-128 concatenated",
	0x90: "UPCE1+5",
	0x06: "ITF",
	0x28: "Macro PDF",
	UNKNOWN: "UNKNOWN"
};

// HELPER - Create a Uint8Array based on two different Uint8Arrays
const _appendBuffer = (buffer1, buffer2) => {
	const temp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
	temp.set(new Uint8Array(buffer1), 0);
	temp.set(new Uint8Array(buffer2), buffer1.byteLength);
	return temp;
};

// HELPER - Convert byteArray to long integer
const byteArrayToLong = byteArray => {
	let value = 0;
	for (let i = byteArray.length - 1; i >= 0; i--) {
		value = value * 256 + byteArray[i] * 1;
	}
	return value;
};

// HELPER - Extract packed timestamps
const extractPackedTimestamp = (b1, b2, b3, b4, b) => {
	let longDate = byteArrayToLong([b1, b2, b3, b4]);
	const year = 2000 + parseInt(longDate & 0x3f); // & 63
	longDate >>= 6;
	const month = parseInt(longDate & 0x0f) - 1; // & 15
	longDate >>= 4;
	const day = parseInt(longDate & 0x1f); // & 31
	longDate >>= 5;
	const hour = parseInt(longDate & 0x1f); // & 31
	longDate >>= 5;
	const mins = parseInt(longDate & 0x3f); // & 63
	longDate >>= 6;
	const secs = parseInt(longDate & 0x3f); // & 63

	const extractedDate = new Date(year, month, day, hour, mins, secs);
	return extractedDate;
};

// HELPER - Set time  -- not correctly implemented, need to represent 'mappedTime' two digit format
const resetTime = () => {
	const now = new Date();
	const year = now.getFullYear() - 2000;
	const month = now.getMonth() + 1;
	const day = now.getDate();
	const hr = now.getHours();
	const mins = now.getMinutes();
	const secs = now.getSeconds();
	const nowArr = [secs, mins, hr, day, month, year];
	const mappedTime = nowArr
		.map(time => {
			String(time).codePointAt(0);
		})
		.join("");
	const resetTime = new Buffer([0x09, 0x02, 0x06, mappedTime, 0x00]);
	//do the joining stuff.. // 0x5e, 0x9f]);
	return resetTime;
};

module.exports.SymbolCrc16 = SymbolCrc16;
module.exports.symbologies = symbologies;
module.exports._appendBuffer = _appendBuffer;
module.exports.extractPackedTimestamp = extractPackedTimestamp;
