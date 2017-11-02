// Electron Communication
const electron = require("electron");
let { remote } = electron;
const { ipcRenderer } = electron;

// Default timeout for requests to Electron wrapper
const DEFAULT_TIMEOUT = 10000;

// Bootup application
export const e_bootupApplication = () => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("bootup-application");
		ipcRenderer.once("bootup-application-response", (event, arg) => {
			if (arg.error) {
				reject(arg);
			} else {
				resolve(arg);
			}
		});
		setTimeout(reject, DEFAULT_TIMEOUT);
	});
};

// Disconnect the current device
export const e_closeConnection = () => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("close-connection");
		ipcRenderer.once("close-connection-response", (event, arg) => {
			if (arg.error) {
				reject(arg);
			} else {
				resolve(arg);
			}
		});
		setTimeout(reject, DEFAULT_TIMEOUT);
	});
};

// Create a current device
export const e_createConnection = device => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("create-connection", device);
		ipcRenderer.once("create-connection-response", (event, arg) => {
			if (arg.error) {
				reject(arg);
			} else {
				resolve(arg);
			}
		});
		setTimeout(reject, DEFAULT_TIMEOUT);
	});
};

// Refresh the device list
export const e_refreshConnections = () => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("refresh-connections");
		ipcRenderer.once("refresh-connections-response", (event, arg) => {
			if (arg.error) {
				reject(arg);
			} else {
				resolve(arg);
			}
		});
		setTimeout(reject, DEFAULT_TIMEOUT);
	});
};

// Initialize - clear the device, reset time
export const e_initializeDevice = obj => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("clear-device", obj);
		ipcRenderer.once("clear-device-response", (event, arg) => {
			if (arg.error) {
				reject(arg);
			} else {
				ipcRenderer.send("reset-time", obj);
				ipcRenderer.once("reset-time-response", (eventReset, argReset) => {
					if (argReset.error) {
						reject(argReset);
					} else {
						resolve({ barcodes: [], time: argReset.time });
					}
				});
			}
		});
		setTimeout(reject, DEFAULT_TIMEOUT);
	});
};

// Reset the device time
export const e_resetDeviceTime = comName => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("reset-time", { comName });
		ipcRenderer.once("reset-time-response", (event, arg) => {
			if (arg.error) {
				reject(arg);
			} else {
				resolve(arg);
			}
		});
		setTimeout(reject, DEFAULT_TIMEOUT);
	});
};

// Upload barcodes
export const e_uploadScans = scanObj => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("upload-scans", scanObj);
		ipcRenderer.once("upload-scans-response", (event, arg) => {
			console.log(arg);
			if (arg.error) {
				reject(arg);
			} else {
				resolve(arg);
			}
		});
		setTimeout(reject, DEFAULT_TIMEOUT);
	});
};
