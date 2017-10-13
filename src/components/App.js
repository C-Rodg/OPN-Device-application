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

class App extends Component {
	static defaultProps = {
		color: "#cc7f29",
		theme: "dark"
	};

	state = {
		isAuthenticated: false,
		selectedTab: "summary"
	};

	componentDidMount() {
		console.log("MOUNTED <APP/>");
		// ipcRenderer.send("get-devices");
		// ipcRenderer.on("get-devices-response", (event, arg) => {
		// 	console.log(event);
		// 	console.log(arg);
		// });
	}

	// Authenticate the user
	authenticate = () => {
		this.setState({ isAuthenticated: true });
	};

	render() {
		return (
			<div className="app">
				<Nav />
				<main>
					<Route path="/" exact component={ContentSummary} />

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
					<Route path="/devices" exact component={ContentDevices} />
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
