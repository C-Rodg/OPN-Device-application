import React, { Component } from "react";

import { Text } from "react-desktop/windows";

class DeviceContent extends Component {
	state = {
		counter: 0
	};

	update() {}
	render() {
		return (
			<Text color="#fff">
				My deviceeee content...
				{this.state.counter}
				<button
					onClick={() => this.setState({ counter: this.state.counter + 1 })}
				>
					Click me!
				</button>
			</Text>
		);
	}
}

export default DeviceContent;
