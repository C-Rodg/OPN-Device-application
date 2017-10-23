import React, { Component } from "react";
import AlertContainer from "react-alert";

import { alertOptions } from "../utils/alertOptions";
import "../styles/data.css";
import ScanListItem from "./ScanListItem";

class ContentData extends Component {
	renderScans = () => {
		if (this.props.barcodes && this.props.barcodes.length) {
			return this.props.barcodes.map(code => {
				return (
					<ScanListItem
						key={code.time}
						scanId={code.data}
						scanTime={code.time}
					/>
				);
			});
		} else {
			return "";
		}
	};

	render() {
		return (
			<div className="container content-data">
				<AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
				<div className="content-scans-list">
					<div className="pre-card-section-title">
						{this.props.barcodes && this.props.barcodes.length
							? this.props.barcodes.length
							: "0"}{" "}
						Scans:
					</div>
					<div className="scans-list-list card">{this.renderScans()}</div>
				</div>
			</div>
		);
	}
}

export default ContentData;
