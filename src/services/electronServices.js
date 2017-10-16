// Electron Communication
const electron = require("electron");
let { remote } = electron;
const { ipcRenderer } = electron;

// Bootup application
export const e_bootupApplication = () => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("bootup-application");
		ipcRenderer.on("bootup-application-response", (event, arg) => {
			resolve(arg);
		});
	});
};

// Disconnect the current device
export const e_closeConnection = () => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("close-connection");
		ipcRenderer.on("close-connection-response", (event, arg) => {
			if (arg.success) {
				resolve(arg);
			} else {
				reject(arg);
			}
		});
	});
};

// Create a current device
export const e_createConnection = device => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("create-connection", device);
		ipcRenderer.on("create-connection-response", (event, arg) => {
			if (arg.success) {
				resolve(arg);
			} else {
				reject(arg);
			}
		});
	});
};

// Get List of Devices
export const e_getDevices = () => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("get-devices");
		ipcRenderer.on("get-devices-response", (event, arg) => {
			resolve(arg);
		});
	});
};

// Connect to a device
export const e_connectDevice = com => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("connect-device", com);
		ipcRenderer.on("connect-device-response", (event, arg) => {
			console.log(arg);
			resolve(arg);
		});
	});
};
