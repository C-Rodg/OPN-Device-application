import React, { Component } from "react";
import { Portal } from "react-portal";
import "../styles/portal.css";
import moment from "moment";

class ClearDevicePortal extends Component {
	constructor() {
		super();
		this.state = {
			currentDate: moment(),
			offset: 0
		};
		this.interval = setInterval(this.updateDateTick, 1000);
	}

	// Clear timer
	componentWillUnmount() {
		clearInterval(this.interval);
	}

	// Update the current date
	updateDateTick = () => {
		let currentDate;
		if (this.state.offset >= 0) {
			currentDate = moment().add(this.state.offset, "h");
		} else {
			currentDate = moment().subtract(Math.abs(this.state.offset), "h");
		}
		this.setState({
			currentDate
		});
	};

	// Add/Subtract hour from device time
	modifyTime = isAdd => {
		const offset = isAdd ? this.state.offset + 1 : this.state.offset - 1;
		this.setState({
			offset
		});
	};

	render() {
		return (
			<Portal>
				<div className="portal delete-item-portal">
					<div className="card">
						<div className="portal-body">
							<div className="portal-title">
								Are you sure you want to clear ALL data and reset the device
								time?
							</div>
							<div className="delete-content">
								<div className="delete-id-title">
									This action cannot be undone.
								</div>
								<div className="delete-id">
									Clearing{" "}
									{this.props.scanCount === 1
										? `${this.props.scanCount} scan.`
										: `${this.props.scanCount} scans.`}
								</div>

								<div className="delete-id-title">New Device Time:</div>
								<div className="delete-id clock-tick">
									{this.state.currentDate.format("h:mm:ss A, MMM Do, YYYY")}
								</div>
								<div className="time-controls">
									<div
										className="time-control subtract"
										onClick={() => this.modifyTime(false)}
									>
										-1 Hour
									</div>
									<div
										className="time-control add"
										onClick={() => this.modifyTime(true)}
									>
										+1 Hour
									</div>
								</div>
							</div>
						</div>

						<div className="delete-actions portal-actions">
							<div
								className="portal-cancel portal-action"
								onClick={this.props.onCancel}
							>
								Cancel
							</div>
							<div
								className="portal-confirm portal-action"
								onClick={() => this.props.onConfirmClear(this.state.offset)}
							>
								Delete
							</div>
						</div>
					</div>
				</div>
			</Portal>
		);
	}
}

export default ClearDevicePortal;
