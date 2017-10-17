// Electron Communication
const electron = require("electron");
let { remote } = electron;
const { ipcRenderer } = electron;

// Bootup application
export const e_bootupApplication = () => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("bootup-application");
		ipcRenderer.on("bootup-application-response", (event, arg) => {
			if (arg.error) {
				reject(arg);
			} else {
				resolve(arg);
			}
		});
	});
};

// Disconnect the current device
export const e_closeConnection = () => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("close-connection");
		ipcRenderer.on("close-connection-response", (event, arg) => {
			if (arg.error) {
				reject(arg);
			} else {
				resolve(arg);
			}
		});
	});
};

// Create a current device
export const e_createConnection = device => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("create-connection", device);
		ipcRenderer.on("create-connection-response", (event, arg) => {
			if (arg.error) {
				reject(arg);
			} else {
				resolve(arg);
			}
		});
	});
};
