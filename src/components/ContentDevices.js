import React, { Component } from "react";

import "../styles/devices.css";
import ActionButton from "./ActionButton";
import OtherDeviceTile from "./OtherDeviceTile";
import CurrentDeviceTile from "./CurrentDeviceTile";
import ClearDevicePortal from "./ClearDevicePortal";

class ContentDevices extends Component {
	state = {
		isShowingClearPortal: false
	};

	// Render other devices
	renderOtherDevices = () => {
		if (this.props.deviceList.length === 0) {
			return <div className="no-device">No devices connected...</div>;
		}
		let { deviceList } = this.props;
		if (this.props.currentDevice) {
			deviceList = deviceList.filter(
				dev => dev.pnpId !== this.props.currentDevice.pnpId
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
			this.props.onCreateConnection(device);
		}
	};

	// Render current device
	renderCurrentDevice = () => {
		// Check for no current devices
		if (!this.props.currentDevice) {
			return <div className="no-device">No device currently set...</div>;
		}
		return (
			<CurrentDeviceTile
				{...this.props.currentDevice}
				closeDevice={this.props.onCloseConnection}
				clearDevice={this.handleClearCurrentClick}
				uploadDevice={this.handleUploadCurrentClick}
			/>
		);
	};

	// Upload scans from current device
	handleUploadCurrentClick = () => {
		// handle upload...
	};

	// Clear scans from current device
	handleClearCurrentClick = () => {
		// handle clear device
		this.setState({
			isShowingClearPortal: true
		});
	};

	// Cancel the Clear modal
	handleCloseClearModal = () => {
		this.setState({
			isShowingClearPortal: false
		});
	};

	// Clear device confirmed
	handleConfirmedClear = () => {
		// TODO: CLEAR DEVICE
		this.setState(
			{
				isShowingClearPortal: false
			},
			() => {
				this.props.onNotification({
					type: "success",
					message: "Successfully cleared device!",
					isShort: false
				});
			}
		);
	};

	// Render component
	render() {
		return (
			<div className="container content-devices">
				<div className="content-devices-list">
					<div className="content-devices-list-current">
						<div className="pre-card-section-title">Current Device:</div>
						<div className="devices-list-list">
							{this.renderCurrentDevice()}
						</div>
					</div>
					<div className="content-devices-list-other">
						<div className="pre-card-section-title">Other Devices:</div>
						<div className="devices-list-list">{this.renderOtherDevices()}</div>
					</div>
				</div>
				<ActionButton icon="refresh" cb={this.props.onRefreshDevices} />
				{this.state.isShowingClearPortal && (
					<ClearDevicePortal
						scanCount={this.props.barcodes.length}
						onConfirmClear={this.handleConfirmedClear}
						onCancel={this.handleCloseClearModal}
					/>
				)}
			</div>
		);
	}
}

export default ContentDevices;
