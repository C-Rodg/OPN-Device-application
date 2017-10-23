import React from "react";
import { Portal } from "react-portal";

const DeleteItemPortal = ({ onCancel, onConfirmDelete, scan }) => {
	return (
		<Portal>
			<div className="portal delete-item-portal">
				<div className="card">
					<div className="portal-body">
						<div className="portal-title">
							Are you sure you want to delete this scan?
						</div>
						<div className="delete-content">
							<div className="delete-id-title">Scan Data:</div>
							<div className="delete-id">{scan.data}</div>
						</div>
					</div>

					<div className="delete-actions portal-actions">
						<div className="portal-cancel portal-action" onClick={onCancel}>
							Cancel
						</div>
						<div
							className="portal-confirm portal-action"
							onClick={onConfirmDelete}
						>
							Delete
						</div>
					</div>
				</div>
			</div>
		</Portal>
	);
};

export default DeleteItemPortal;
