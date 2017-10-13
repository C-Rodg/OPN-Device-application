import React, { Component } from "react";
import injectTapEventPlugin from 'react-tap-event-plugin';
import "../styles/default.css";


// Electron Communication
const electron = require("electron");
let { remote } = electron;
const { ipcRenderer } = electron;


// Fix for tap events?
injectTapEventPlugin();

class App extends Component {
	static defaultProps = {
		color: "#cc7f29",
		theme: "dark"
	};

	state = {
		selectedTab: 'summary'
	};

	componentDidMount() {
		console.log("MOUNTED <APP/>");
		ipcRenderer.send("get-devices");
		ipcRenderer.on("get-devices-response", (event, arg) => {
			console.log(event);
			console.log(arg);
		});
	}


	render() {
		return (
			<div className="app">
				My App content here...
			</div>
		);
	}
}

export default App;
