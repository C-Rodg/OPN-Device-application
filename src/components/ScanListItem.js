import React, { Component } from "react";
import moment from "moment";

import "../styles/scan-list-item.css";
import { quickDateFormat, displayDateFormat } from "../utils/dateFormats";

class ScanListItem extends Component {
	state = {
		isOpen: false,
		isScanCode: false
	};

	componentDidMount() {
		if (this.props.scanId && this.props.scanId.indexOf("-SC-") > -1) {
			this.setState({ isScanCode: true });
		}
	}

	renderScanTime = () => {
		return moment(this.props.scanTime, quickDateFormat).format(
			displayDateFormat
		);
	};

	handleActionClick = (isAdd, idx) => {
		if (isAdd) {
			this.props.onOpenAddPortal(idx);
		} else {
			this.props.onOpenDeletePortal(idx);
		}
		this.setState({ isOpen: false });
	};

	render() {
		return (
			<div
				className={[
					"scan-list-item",
					this.state.isScanCode ? "is-scan-code" : ""
				].join(" ")}
			>
				<div className="scan-item-content">
					<div
						className="more-item-info icon-card-hover"
						onClick={() => this.setState({ isOpen: !this.state.isOpen })}
					>
						<i className="material-icons">more_horiz</i>
					</div>
					<div className="item-id">{this.props.scanId}</div>
					<div className="item-time">{this.renderScanTime()}</div>
				</div>
				<div
					className={[
						"scan-item-actions",
						this.state.isOpen ? "is-open" : ""
					].join(" ")}
				>
					<i
						className="material-icons action-icon remove"
						onClick={() => this.handleActionClick(false, this.props.idx)}
					>
						remove_circle_outline
					</i>
					<i
						className="material-icons action-icon add"
						onClick={() => this.handleActionClick(true, this.props.idx)}
					>
						add_circle_outline
					</i>
				</div>
			</div>
		);
	}
}

export default ScanListItem;
