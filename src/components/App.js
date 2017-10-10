import React, { Component } from "react";
import "../styles/default.css";
import {
	Window,
	TitleBar,
	NavPane,
	NavPaneItem,
	Text
} from "react-desktop/windows";

const electron = require("electron");
let { remote } = electron;
const { ipcRenderer } = electron;

class App extends Component {
	static defaultProps = {
		color: "#cc7f29",
		theme: "dark"
	};

	state = {
		isMaximized: false
	};

	componentDidMount() {
		console.log("MOUNTED <APP/>");
		ipcRenderer.send("get-devices");
		ipcRenderer.on("get-devices-response", (event, arg) => {
			console.log(event);
			console.log(arg);
		});
	}

	// WINDOW - close
	close() {
		let window = remote.BrowserWindow.getFocusedWindow();
		window.close();
	}

	// WINDOW - minimize
	minimize() {
		let window = remote.BrowserWindow.getFocusedWindow();
		window.minimize();
	}

	// WINDOW - maximize
	maximize() {
		let window = remote.BrowserWindow.getFocusedWindow();
		window.maximize();
	}

	// WINDOW - unmaximize
	unmaximize() {
		let window = remote.BrowserWindow.getFocusedWindow();
		window.unmaximize();
	}

	// WINDOW - toggle maximize
	toggleMaximize = () => {
		if (!this.state.isMaximized) {
			this.maximize();
		} else {
			this.unmaximize();
		}
		this.setState({ isMaximized: !this.state.isMaximized });
	};

	render() {
		return (
			<Window
				color={this.props.color}
				theme={this.props.theme}
				chrome
				padding="12px"
			>
				<TitleBar
					title="Validar Quickscan Central"
					controls
					isMaximized={this.state.isMaximized}
					onCloseClick={this.close}
					onMaximizeClick={this.toggleMaximize}
					onMinimizeClick={this.minimize}
					onRestoreDownClick={this.toggleMaximize}
				/>
				<NavPane>
					<NavPaneItem title="Summary">
						<Text>Summary</Text>
					</NavPaneItem>
					<NavPaneItem title="Data">
						<Text>Data</Text>
					</NavPaneItem>
					<NavPaneItem title="Devices">
						<Text>Devices</Text>
					</NavPaneItem>
				</NavPane>
			</Window>
		);
	}
}

export default App;
