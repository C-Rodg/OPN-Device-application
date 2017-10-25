import React from "react";

import { isQuickscan } from "../utils/helperUtils";

const CurrentDeviceTile = device => {
	const isQuick = isQuickscan(device);

	return (
		<div className="device-tile current-device-tile card">
			<div className="icon-card-hover close-icon" onClick={device.closeDevice}>
				<i className="material-icons">close</i>
			</div>
			<div
				className="icon-card-hover reset-time-icon"
				onClick={device.resetTime}
			>
				<i className="material-icons">access_time</i>
			</div>
			<div className="device-row device-name">
				<span className="device-header">Device Type:</span>
				{isQuick ? " Quickscan" : " Other"}
			</div>
			<div className="device-row device-manufacturer">
				<span className="device-header">Manufacturer:</span>{" "}
				{device.manufacturer}
			</div>
			<div className="device-row device-port">
				<span className="device-header">Port:</span> {device.comName}
			</div>
			{isQuick && (
				<div>
					<div className="device-row device-port">
						<span className="device-header">Device ID:</span> {device.deviceId}
					</div>
					<div className="device-row device-port">
						<span className="device-header">Device Time:</span>{" "}
						{device.deviceTime}
					</div>
					<div className="device-row device-port">
						<span className="device-header">Time Connected:</span>{" "}
						{device.currentTime}
					</div>
					<div className="device-row device-port">
						<span className="device-header">Clock Drift:</span>{" "}
						{device.clockDrift}
					</div>
				</div>
			)}
			<div className="device-row device-actions">
				<div
					className="device-action action-clear"
					onClick={device.clearDevice}
				>
					<i className="material-icons">delete_forever</i>
					<span className="icon-title"> Clear</span>
				</div>
				<div
					className="device-action action-upload"
					onClick={device.uploadDevice}
				>
					<i className="material-icons">file_upload</i>
					<span className="icon-title"> Upload</span>
				</div>
			</div>
		</div>
	);
};

export default CurrentDeviceTile;
