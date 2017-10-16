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
		deviceList: []
	};

	componentDidMount() {
		e_bootupApplication()
			.then(data => {
				const { deviceList, currentDevice } = data;
				this.setState({ deviceList, currentDevice });
			})
			.catch(err => {
				console.log(err);
			});
	}

	// Authenticate the user
	authenticate = () => {
		this.setState({ isAuthenticated: true });
	};

	// Close the current connection
	handleCloseConnection = () => {
		e_closeConnection()
			.then(data => {
				this.setState({ currentDevice: null });
			})
			.catch(err => {
				console.log(err);
			});
	};

	// Create a new connection
	handleCreateConnection = device => {
		e_createConnection(device)
			.then(data => {
				const { deviceList, currentDevice } = data;
				this.setState({ deviceList, currentDevice });
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
