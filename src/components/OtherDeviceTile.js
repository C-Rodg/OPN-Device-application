import React from "react";

import { isQuickscan } from "../utils/helperUtils";

const OtherDeviceTile = device => {
	const isQuick = isQuickscan(device);
	return (
		<div
			className={[
				"card",
				"device-tile",
				"other-device-tile",
				!isQuick ? "cancel-device" : ""
			].join(" ")}
			onClick={() => device.setDevice(isQuick, device)}
		>
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
		</div>
	);
};

export default OtherDeviceTile;
