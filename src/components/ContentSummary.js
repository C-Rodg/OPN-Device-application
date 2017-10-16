import React, { Component } from "react";

import "../styles/summary.css";

class ContentSummary extends Component {
	componentDidMount() {
		// e_connectDevice("COM4")
		// 	.then(resp => {
		// 		console.log(resp);
		// 	})
		// 	.catch(err => console.log(err));
		console.log(this.props.deviceList);
	}

	render() {
		return (
			<div className="container content-summary">
				Contenttttt Summmarryryyyyyy
			</div>
		);
	}
}

export default ContentSummary;
