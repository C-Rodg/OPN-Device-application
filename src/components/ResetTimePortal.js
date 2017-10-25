import React from "react";
import { Portal } from "react-portal";
import "../styles/portal.css";
import moment from "moment";

const ResetTimePortal = ({ onCancel, onConfirmReset }) => {
	return (
		<Portal>
			<div className="portal reset-time-portal">
				<div className="card">
					<div className="portal-body">
						<div className="portal-title">
							Are you sure you want to reset the device time?
						</div>
						<div className="delete-content">
							<div className="delete-id-title">Current Time:</div>
							<div className="delete-id">
								{moment().format("h:mm A, MMM Do, YYYY")}
							</div>
						</div>
					</div>

					<div className="delete-actions portal-actions">
						<div className="portal-cancel portal-action" onClick={onCancel}>
							Cancel
						</div>
						<div
							className="portal-confirm portal-action"
							onClick={onConfirmReset}
						>
							Reset
						</div>
					</div>
				</div>
			</div>
		</Portal>
	);
};

export default ResetTimePortal;
