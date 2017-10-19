import React, { Component } from "react";
import AlertContainer from "react-alert";

import { alertOptions } from "../utils/alertOptions";
import "../styles/data.css";

class ContentData extends Component {
	render() {
		return (
			<div className="container content-data">
				<AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
			</div>
		);
	}
}

export default ContentData;
