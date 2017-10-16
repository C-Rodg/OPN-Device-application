import React, { Component } from "react";

import ActionButton from "./ActionButton";
import OtherDeviceTile from "./OtherDeviceTile";
import CurrentDeviceTile from "./CurrentDeviceTile";
import { e_getDevices } from "../services/electronServices";

import "../styles/devices.css";

class ContentDevices extends Component {
	constructor() {
		super();

		const currentDevice = window.localStorage.getItem("currentDevice");
		const obj = Object.assign({}, { devices: [], currentDevice: null });
		if (currentDevice) {
			obj.currentDevice = JSON.parse(currentDevice);
		}
		this.state = obj;
	}

	componentDidMount() {
		this.getDevices();
	}

	// Get Devices from electron
	getDevices = () => {
		e_getDevices()
			.then(devices => {
				console.log(devices);
				this.setState({ devices });
			})
			.catch(err => console.log(err));
	};

	// Render other devices
	renderOtherDevices = () => {
		if (this.state.devices.length === 0) {
			return <div className="no-device">No devices connected...</div>;
		}
		let deviceList = this.state.devices;
		if (this.state.currentDevice) {
			deviceList = deviceList.filter(
				dev => dev.pnpId !== this.state.currentDevice.pnpId
			);
		}
		return deviceList.map(device => {
			return (
				<OtherDeviceTile
					key={[device.manufacturer, device.comName].join("-")}
					{...device}
					setDevice={this.handleOtherDeviceClick}
				/>
			);
		});
	};

	// Set new current device
	handleOtherDeviceClick = (isQuick, device) => {
		if (isQuick) {
			this.setState({ currentDevice: device }, () => {
				window.localStorage.setItem("currentDevice", JSON.stringify(device));
			});
		}
	};

	// Render current device
	renderCurrentDevice = () => {
		// Check for no current devices
		if (!this.state.currentDevice) {
			return <div className="no-device">No device currently set...</div>;
		}
		return (
			<CurrentDeviceTile
				{...this.state.currentDevice}
				closeDevice={this.handleCloseCurrentClick}
				clearDevice={this.handleClearCurrentClick}
				uploadDevice={this.handleUploadCurrentClick}
			/>
		);
	};

	// Handle closing out current device
	handleCloseCurrentClick = () => {
		this.setState({ currentDevice: null }, () => {
			window.localStorage.removeItem("currentDevice");
		});
	};

	// Upload scans from current device
	handleUploadCurrentClick = () => {
		// handle upload...
	};

	// Clear scans from current device
	handleClearCurrentClick = () => {
		// handle clear device
	};

	// Render component
	render() {
		return (
			<div className="container content-devices">
				<div className="content-devices-list">
					<div className="content-devices-list-current">
						<div className="devices-list-title">Current Device:</div>
						<div className="devices-list-list">
							{this.renderCurrentDevice()}
						</div>
					</div>
					<div className="content-devices-list-other">
						<div className="devices-list-title">Other Devices:</div>
						<div className="devices-list-list">{this.renderOtherDevices()}</div>
					</div>
				</div>
				<ActionButton icon="refresh" cb={this.getDevices} />
			</div>
		);
	}
}

export default ContentDevices;
