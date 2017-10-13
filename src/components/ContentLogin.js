import React, { Component } from "react";
import "../styles/login.css";

class ContentLogin extends Component {
	state = {
		pass: "",
		error: false
	};

	// Check Password
	checkPassword = ev => {
		ev.preventDefault();
		if (this.state.pass === "9151") {
			// Handle callback and navigate to correct page
			this.props.onAuthenticate();
		} else {
			// Show error
			this.setState({ error: true });
		}
	};

	render() {
		return (
			<div className="container content-login">
				<div className="card">
					<h1 className="card-title">Login</h1>
					<form onSubmit={this.checkPassword}>
						<div className="input-container">
							<input
								type="password"
								id="data-password"
								required="required"
								value={this.state.pass}
								onChange={ev => this.setState({ pass: ev.target.value })}
							/>
							<label htmlFor="data-password">Password</label>
							<div className="bar" />
						</div>
						{this.state.error && (
							<div className="password-error">Please try again...</div>
						)}
						<div className="button-container">
							<button type="submit">
								<span>Go</span>
							</button>
						</div>
					</form>
					<div className="edit-box">
						<i className="material-icons">edit</i>
					</div>
				</div>
			</div>
		);
	}
}

export default ContentLogin;
