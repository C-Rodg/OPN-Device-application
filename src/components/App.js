import React, { Component } from "react";
import "../styles/default.css";
import { Route, NavLink } from 'react-router-dom';

// Electron Communication
const electron = require("electron");
let { remote } = electron;
const { ipcRenderer } = electron;

const SummaryRoute = () => {
	return (
		<div className="TEST">Summary!</div>
	);
};
const DataRoute = () => {
	return (
		<div className="TEST">Dataaa!</div>
	);
};
const DevicesRoute = () => {
	return (
		<div className="TEST">Devicesss!</div>
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
				<nav>
					<div className="nav-title">
						Validar Quickscan Central
					</div>
					<div className="nav-items">
						<NavLink to="/" activeClassName="nav-active">Summary</NavLink>
						<NavLink to="/data" activeClassName="nav-active">Data</NavLink>
						<NavLink to="/devices" activeClassName="nav-active">Devices</NavLink>
					</div>
				</nav>
				<main>
					<Route path="/" exact component={SummaryRoute} />
					<Route path="/data" exact component={DataRoute} />
					<Route path="/devices" exact component={DevicesRoute} />
				</main>
			</div>
		);
	}
}

export default App;