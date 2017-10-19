// Imports
import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

// Components
import "../styles/default.css";
import ContentData from "./ContentData";
import ContentDevices from "./ContentDevices";
import ContentSummary from "./ContentSummary";
import ContentLogin from "./ContentLogin";
import Nav from "./Nav";

// Services
import {
	e_bootupApplication,
	e_closeConnection,
	e_createConnection
} from "../services/electronServices";

class App extends Component {
	static defaultProps = {
		color: "#cc7f29",
		theme: "dark"
	};

	state = {
		isAuthenticated: false,
		selectedTab: "summary",

		currentDevice: null,
		deviceList: [],
		deviceTime: {},
		deviceInfo: {},
		barcodes: []
	};

	componentDidMount() {
		// Get initial values
		e_bootupApplication()
			.then(data => {
				console.log(data);
				this.parseDeviceObject(data);
			})
			.catch(err => {
				console.log(err);
			});
	}

	// Parse DeviceInfo object and set state
	parseDeviceObject = data => {
		const { barcodes, devices, info, time } = data;
		let current = null;
		for (let i = 0, j = devices.deviceList.length; i < j; i++) {
			if (devices.deviceList[i].comName === devices.currentPort) {
				current = devices.deviceList[i];
				break;
			}
		}
		this.setState({
			barcodes,
			deviceTime: time,
			deviceInfo: info,
			deviceList: devices.deviceList,
			currentDevice: current
		});
	};

	// Reset Current Device Props
	resetCurrentDevice = () => {
		this.setState({
			currentDevice: null,
			deviceTime: {},
			deviceInfo: {},
			barcodes: []
		});
	};

	// Authenticate the user
	authenticate = () => {
		this.setState({ isAuthenticated: true });
	};

	// Close the current connection
	handleCloseConnection = () => {
		e_closeConnection()
			.then(data => {
				this.resetCurrentDevice();
			})
			.catch(err => {
				console.log(err);
			});
	};

	// Create a new connection
	handleCreateConnection = device => {
		e_createConnection(device)
			.then(data => {
				console.log(data);
				this.parseDeviceObject(data);
			})
			.catch(err => {
				console.log(err);
			});
	};

	render() {
		return (
			<div className="app">
				<Nav />
				<main>
					<Route
						path="/"
						exact
						render={props => {
							return (
								<ContentSummary
									{...props}
									currentDevice={this.state.currentDevice}
									deviceList={this.state.deviceList}
									deviceInfo={this.state.deviceInfo}
									deviceTime={this.state.deviceTime}
									barcodes={this.state.barcodes}
								/>
							);
						}}
					/>

					<Route
						path="/data"
						exact
						render={props => {
							return this.state.isAuthenticated ? (
								<ContentData {...props} />
							) : (
								<ContentLogin {...props} onAuthenticate={this.authenticate} />
							);
						}}
					/>
					<Route
						path="/devices"
						exact
						render={props => {
							return (
								<ContentDevices
									{...props}
									currentDevice={this.state.currentDevice}
									deviceList={this.state.deviceList}
									onCloseConnection={this.handleCloseConnection}
									onCreateConnection={this.handleCreateConnection}
								/>
							);
						}}
					/>
					<Route
						path="/login"
						exact
						render={() => {
							return <ContentLogin onAuthenticate={this.authenticate} />;
						}}
					/>
				</main>
			</div>
		);
	}
}

export default App;
