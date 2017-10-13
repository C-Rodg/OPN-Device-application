import React, { Component } from "react";
import "../styles/default.css";
import { Route } from 'react-router-dom';

// Electron Communication
const electron = require("electron");
let { remote } = electron;
const { ipcRenderer } = electron;

const TestRoute = () => {
	return (
		<div className="TEST">TEST ROUTE SHOWED!</div>
	);
};


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
				<main>
					<Route path="/test" exact component={TestRoute} />
				</main>
			</div>
		);
	}
}

export default App;