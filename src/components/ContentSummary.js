import React, { Component } from "react";
import AlertContainer from "react-alert";
import { Link } from "react-router-dom";

import "../styles/summary.css";
import { alertOptions } from "../utils/alertOptions";

class ContentSummary extends Component {
	componentDidMount() {}

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

	render() {
		return (
			<div className="container content-summary">
				<AlertContainer ref={a => (this.msg = a)} {...alertOptions} />

				<div className="card sum-total">
					<div className="sum-total-wrapper">
						<span className="sum-total-num">{this.props.barcodes.length}</span>
						<span className="sum-total-text">
							{" "}
							Total {this.props.barcodes.length !== 1 ? "Scans" : "Scan"}
						</span>
					</div>
					<div className="sum-actions">
						<i className="material-icons">file_upload</i>
						<span className="icon-title">Upload Now!</span>
					</div>
				</div>

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
						<span className="info-sub-answer">10:21 AM, JUN 10th, 2017</span>
					</div>
					<div className="sum-info-last sum-row">
						<span className="info-sub-title">Last Scan:</span>
						<span className="info-sub-answer">10:41 AM, JUN 23rd, 2017</span>
					</div>
				</div>

				<div className="card sum-device">
					<Link to="/devices" className="nav-icon">
						<i className="material-icons">info_outline</i>
					</Link>
					<div className="sum-device-title sum-title">Device Information:</div>
					<div className="sum-device-id sum-row">
						<span className="info-sub-title">Device ID:</span>
						<span className="info-sub-answer">9016002</span>
					</div>
					<div className="sum-device-connected sum-row">
						<span className="info-sub-title">Device Time:</span>
						<span className="info-sub-answer">12:21 AM, JUN 22nd, 2017</span>
					</div>
					<div className="sum-device-connected sum-row">
						<span className="info-sub-title">Time Connected:</span>
						<span className="info-sub-answer">10:21 AM, JUN 21st, 2017</span>
					</div>
					<div className="sum-device-drift sum-row">
						<span className="info-sub-title">Clock Drift:</span>
						<span className="info-sub-answer">1 Day, 2 hours, 12 seconds</span>
					</div>
				</div>
			</div>
		);
	}
}

export default ContentSummary;
