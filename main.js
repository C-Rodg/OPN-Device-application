// Create native window, control app life, communication to window
const electron = require("electron");
const { BrowserWindow, app } = electron;
// Other Imports
const path = require("path");
const url = require("url");

// Electron Container Application Services
const services = require("./container/backend-services");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let dev = false;
if (
	process.defaultApp ||
	/[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
	/[\\/]electron[\\/]/.test(process.execPath)
) {
	dev = true;
}

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 960,
		height: 720,
		show: false,
		//frame: false,
		//transparent: true,
		//fullscreen: true,
		resizable: true,
		minimizable: true,
		movable: true,
		closable: true,
		fullscreenable: true,
		title: "Quickscan Central",
		frame: true
		//backgroundColor: '#00796b'
	});

	let indexPath;
	if (dev && process.argv.indexOf("--noDevServer") === -1) {
		indexPath = url.format({
			protocol: "http:",
			host: "localhost:8080",
			pathname: "index.html",
			slashes: true
		});
	} else {
		indexPath = url.format({
			protocol: "file:",
			pathname: path.join(__dirname, "dist", "index.html"),
			slashes: true
		});
	}

	mainWindow.loadURL(indexPath);

	// Open the DevTools.
	//mainWindow.webContents.openDevTools();

	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
		if (dev) {
			mainWindow.webContents.openDevTools();
		}
	});

	// Emitted when the window is closed.
	mainWindow.on("closed", function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	app.quit();
});

app.on("activate", function() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});
