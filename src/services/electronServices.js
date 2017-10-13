// Electron Communication
const electron = require("electron");
let { remote } = electron;
const { ipcRenderer } = electron;

export const e_getDevices = () => {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("get-devices");
		ipcRenderer.on("get-devices-response", (event, arg) => {
			resolve(arg);
		});
	});
};
