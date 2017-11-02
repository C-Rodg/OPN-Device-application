// Imports
import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import AlertContainer from "react-alert";

// Components
import "../styles/default.css";
import ContentData from "./ContentData";
import ContentDevices from "./ContentDevices";
import ContentSummary from "./ContentSummary";
import ContentLogin from "./ContentLogin";
import Nav from "./Nav";
import { alertOptions, shortAlert } from "../utils/alertOptions";

// Services
import {
	e_bootupApplication,
	e_closeConnection,
	e_createConnection,
	e_refreshConnections,
	e_clearDevice,
	e_resetDeviceTime
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

	// Deletion of a barcode is confirmed
	handleDeleteBarcode = idx => {
		const newBarcodeList = this.state.barcodes.filter((code, currentIdx) => {
			return currentIdx !== idx;
		});
		this.setState({
			barcodes: newBarcodeList
		});
	};

	// Adding new scan confirmed
	handleAddBarcode = (idx, scan) => {
		const firstBarcodes = this.state.barcodes.slice(0, idx + 1);
		const lastBarcodes = this.state.barcodes.slice(idx + 1);
		this.setState({
			barcodes: [...firstBarcodes, scan, ...lastBarcodes]
		});
	};

	// Upload Device Data
	handleUploadCurrentData = () => {
		console.log("uploading...");
		console.log(this.state.barcodes);
	};

	// Refresh Device List
	handleRefreshDeviceList = () => {
		e_refreshConnections()
			.then(listResponse => {
				let current = null;
				if (this.state.currentDevice) {
					for (let i = 0, j = listResponse.deviceList.length; i < j; i++) {
						if (
							listResponse.deviceList[i].comName ===
							this.state.currentDevice.comName
						) {
							current = listResponse.deviceList[i];
							break;
						}
					}
				}
				this.setState(
					{
						currentDevice: current,
						deviceList: listResponse.deviceList
					},
					() => {
						this.msg.success("Refreshed device list!", shortAlert);
					}
				);
			})
			.catch(err => {
				console.log(err);
				this.msg.error("Unable to refresh device list..", shortAlert);
			});
	};

	// Notification system
	handleNotification = msgObj => {
		this.msg[msgObj.type](msgObj.message, msgObj.isShort ? shortAlert : {});
	};

	// Clear the device
	handleConfirmedClear = offset => {
		e_clearDevice({ offset, comName: this.state.currentDevice.comName })
			.then(data => {
				this.handleNotification({
					type: "success",
					message: "Successfully cleared device!",
					isShort: false
				});
				this.setState({ barcodes: data.barcodes });
			})
			.catch(err => {
				console.log(err);
				this.handleNotification({
					type: "error",
					message: "Unable to clear this device..",
					isShort: true
				});
			});
	};

	// Reset the device time
	handleResetTime = () => {
		e_resetDeviceTime(this.state.currentDevice.comName)
			.then(data => {
				console.log(data);
				this.handleNotification({
					type: "success",
					message: "Device time reset!",
					isShort: false
				});
				this.setState({ deviceTime: data.time });
			})
			.catch(err => {
				console.log(err);
				this.handleNotification({
					type: "error",
					message: "Unable to reset device time..",
					isShort: true
				});
			});
	};

	render() {
		return (
			<div className="app">
				<AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
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
									onNotification={this.handleNotification}
								/>
							);
						}}
					/>

					<Route
						path="/data"
						exact
						render={props => {
							return this.state.isAuthenticated ? (
								<ContentData
									{...props}
									barcodes={this.state.barcodes}
									deviceTime={this.state.deviceTime}
									deviceInfo={this.state.deviceInfo}
									onConfirmedDelete={this.handleDeleteBarcode}
									onConfirmAdd={this.handleAddBarcode}
									onUploadData={this.handleUploadCurrentData}
									onNotification={this.handleNotification}
								/>
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
									onRefreshDevices={this.handleRefreshDeviceList}
									barcodes={this.state.barcodes}
									onNotification={this.handleNotification}
									deviceTime={this.state.deviceTime}
									deviceInfo={this.state.deviceInfo}
									onConfirmClearDevice={this.handleConfirmedClear}
									onConfirmResetTime={this.handleResetTime}
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
