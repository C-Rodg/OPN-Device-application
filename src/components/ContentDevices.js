import React, { Component } from "react";

import ActionButton from "./ActionButton";
import { e_getDevices } from "../services/electronServices";

import "../styles/devices.css";

class ContentDevices extends Component {
	state = {
		devices: []
	};

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

	// Render component
	render() {
		return (
			<div className="container content-devices">
				Contenttttt Devices
				<div>Other Content</div>
				<ActionButton icon="refresh" cb={this.getDevices} />
			</div>
		);
	}
}

export default ContentDevices;
