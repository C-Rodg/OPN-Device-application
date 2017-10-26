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

// Clear the device
export const e_clearDevice = comName => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("clear-device", { comName });
		ipcRenderer.once("clear-device-response", (event, arg) => {
			if (arg.error) {
				reject(arg);
			} else {
				resolve(arg);
			}
		});
		setTimeout(reject, DEFAULT_TIMEOUT);
	});
};

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
