import React from "react";
import { Portal } from "react-portal";
import "../styles/portal.css";

const ClearDevicePortal = ({ onCancel, onConfirmClear, scanCount }) => {
	return (
		<Portal>
			<div className="portal delete-item-portal">
				<div className="card">
					<div className="portal-body">
						<div className="portal-title">
							Are you sure you want to clear ALL device data?
						</div>
						<div className="delete-content">
							<div className="delete-id-title">
								This action cannot be undone.
							</div>
							<div className="delete-id">
								Clearing{" "}
								{scanCount === 1 ? `${scanCount} scan.` : `${scanCount} scans.`}
							</div>
						</div>
					</div>

					<div className="delete-actions portal-actions">
						<div className="portal-cancel portal-action" onClick={onCancel}>
							Cancel
						</div>
						<div
							className="portal-confirm portal-action"
							onClick={onConfirmClear}
						>
							Delete
						</div>
					</div>
				</div>
			</div>
		</Portal>
	);
};

export default ClearDevicePortal;
