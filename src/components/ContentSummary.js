import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import "../styles/summary.css";
import {
	quickDateFormat,
	displayDateFormat,
	getClockDrift
} from "../utils/dateFormats";

const tooMuchTimeDrift = 300;

class ContentSummary extends Component {
	state = {
		timeDriftError: false
	};

	componentDidMount() {
		if (!this.state.timeDriftError && this.props.deviceTime) {
			if (parseInt(this.props.deviceTime.clockDrift, 10) > tooMuchTimeDrift) {
				this.props.onNotification({
					type: "info",
					message: "The device time and local time seem to be way off..",
					isShort: true
				});
				this.setState({ timeDriftError: true });
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!this.state.timeDriftError) {
			if (parseInt(nextProps.deviceTime.clockDrift, 10) > tooMuchTimeDrift) {
				this.props.onNotification({
					type: "info",
					message: "The device time and local time seem to be way off..",
					isShort: true
				});
				this.setState({ timeDriftError: true });
			}
		}
	}

	// Calculate Unique barcodes
	calculateUniqueBarcodes = () => {
		if (this.props.barcodes && this.props.barcodes.length > 0) {
			const unique = new Set();
			this.props.barcodes.forEach(barcode => {
				unique.add(barcode.data);
			});
			return unique.size === 1 ? unique.size + " scan" : unique.size + " scans";
		}
		return "0 scans";
	};

	// Calculate Session Scans
	calculateSessionScans = () => {
		if (this.props.barcodes && this.props.barcodes.length > 0) {
			const uniqueSessions = new Set();
			this.props.barcodes
				.filter(barcode => {
					return barcode.data.indexOf("-SC-") > -1;
				})
				.forEach(code => {
					uniqueSessions.add(code.data);
				});
			if (uniqueSessions.size === 0) {
				return "No";
			} else if (uniqueSessions.size > 1) {
				return `Yes - ${uniqueSessions.size} session scans`;
			} else {
				return `Yes - ${uniqueSessions.size} session scan`;
			}
		}
		return "No";
	};

	// Convert Quickscan date to display date
	convertFirstLastDisplayDate = isFirst => {
		if (this.props.barcodes && this.props.barcodes.length > 0) {
			if (isFirst) {
				return moment(this.props.barcodes[0].time, quickDateFormat).format(
					displayDateFormat
				);
			} else {
				return moment(
					this.props.barcodes[this.props.barcodes.length - 1].time,
					quickDateFormat
				).format(displayDateFormat);
			}
		}
		return "No scans..";
	};

	// Convert device time to display time
	convertTimesToDisplayDate = time => {
		if (!time) {
			return "-Unknown Device Time-";
		}
		return moment(time, quickDateFormat).format(displayDateFormat);
	};

	// Calculate Clock Drift
	calculateClockDrift = () => {
		if (!this.props.deviceTime.clockDrift) {
			return "-Unknown Clock Drift-";
		}
		return getClockDrift(this.props.deviceTime.clockDrift);
	};

	render() {
		return (
			<div className="container content-summary">
				<div className="top-row">
					<div className="card sum-total">
						<div className="sum-total-wrapper">
							<span className="sum-total-num">
								{this.props.barcodes.length}
							</span>
							<span className="sum-total-text">
								{" "}
								Total {this.props.barcodes.length !== 1 ? "Scans" : "Scan"}
							</span>
						</div>
						<div className="sum-actions" onClick={this.props.onUploadData}>
							<i className="material-icons">file_upload</i>
							<span className="icon-title">Upload Now!</span>
						</div>
					</div>
				</div>
				<div className="second-row">
					<div className="card sum-scan-info">
						<Link to="/data" className="nav-icon">
							<i className="material-icons">info_outline</i>
						</Link>

						<div className="sum-info-title sum-title">Scan Information:</div>
						<div className="sum-info-sessions sum-row">
							<span className="info-sub-title">Session Scans Present?</span>
							<span className="info-sub-answer">
								{this.calculateSessionScans()}
							</span>
						</div>
						<div className="sum-info-total sum-row">
							<span className="info-sub-title">Total Scans:</span>
							<span className="info-sub-answer">
								{this.props.barcodes.length === 1
									? this.props.barcodes.length + " scan"
									: this.props.barcodes.length + " scans"}
							</span>
						</div>
						<div className="sum-info-unique sum-row">
							<span className="info-sub-title">Unique Scans:</span>
							<span className="info-sub-answer">
								{this.calculateUniqueBarcodes()}
							</span>
						</div>
						<div className="sum-info-first sum-row">
							<span className="info-sub-title">First Scan:</span>
							<span className="info-sub-answer">
								{this.convertFirstLastDisplayDate(true)}
							</span>
						</div>
						<div className="sum-info-last sum-row">
							<span className="info-sub-title">Last Scan:</span>
							<span className="info-sub-answer">
								{this.convertFirstLastDisplayDate(false)}
							</span>
						</div>
					</div>

					<div className="card sum-device">
						<Link to="/devices" className="nav-icon">
							<i className="material-icons">info_outline</i>
						</Link>
						<div className="sum-device-title sum-title">
							Device Information:
						</div>
						<div className="sum-device-id sum-row">
							<span className="info-sub-title">Device ID:</span>
							<span className="info-sub-answer">
								{parseInt(this.props.deviceInfo.device, 10) ||
									"-Unknown Device ID-"}
							</span>
						</div>
						<div className="sum-device-connected sum-row">
							<span className="info-sub-title">Device Time:</span>
							<span className="info-sub-answer">
								{this.convertTimesToDisplayDate(
									this.props.deviceTime.deviceTime
								)}
							</span>
						</div>
						<div className="sum-device-connected sum-row">
							<span className="info-sub-title">Time Connected:</span>
							<span className="info-sub-answer">
								{this.convertTimesToDisplayDate(
									this.props.deviceTime.currentTime
								)}
							</span>
						</div>
						<div
							className={[
								"sum-device-drift",
								"sum-row",
								!this.state.timeDriftError ? "" : "error"
							].join(" ")}
						>
							<span className="info-sub-title">Clock Drift:</span>
							<span className="info-sub-answer">
								{this.calculateClockDrift()}
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ContentSummary;
