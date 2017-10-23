import React, { Component } from "react";
import AlertContainer from "react-alert";

import { alertOptions } from "../utils/alertOptions";
import "../styles/data.css";
import ScanListItem from "./ScanListItem";
import DeleteItemPortal from "./DeleteItemPortal";
import AddItemPortal from "./AddItemPortal";

class ContentData extends Component {
	state = {
		isShowingDeletePortal: false,
		isShowingAddPortal: false,
		editPosition: null
	};

	// Open the modal for deleting a scan
	openDeleteModal = idx => {
		this.setState({ isShowingDeletePortal: true, editPosition: idx });
	};

	// Open the modal for adding a scan
	openAddModal = idx => {
		this.setState({ isShowingAddPortal: true, editPosition: idx });
	};

	// Cancel a modal
	handleCancelModal = () => {
		this.setState({
			isShowingAddPortal: false,
			isShowingDeletePortal: false,
			editPosition: null
		});
	};

	// Deletion of scan confirmed
	handleConfirmDelete = () => {
		this.props.onConfirmedDelete(this.state.editPosition);
		this.setState({ isShowingDeletePortal: false, editPosition: null }, () => {
			this.msg.success("Successfully removed scan!");
		});
	};

	// Addition of scan confirmed
	handleConfirmAdd = () => {
		console.log("adding in scan...");
	};

	// Render scan list items
	renderScans = () => {
		if (this.props.barcodes && this.props.barcodes.length) {
			return this.props.barcodes.map((code, idx) => {
				return (
					<ScanListItem
						key={code.time}
						idx={idx}
						scanId={code.data}
						scanTime={code.time}
						onOpenDeletePortal={this.openDeleteModal}
						onOpenAddPortal={this.openAddModal}
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

				{this.state.isShowingDeletePortal && (
					<DeleteItemPortal
						onCancel={this.handleCancelModal}
						onConfirmDelete={this.handleConfirmDelete}
						scan={this.props.barcodes[this.state.editPosition]}
					/>
				)}

				{this.state.isShowingAddPortal && (
					<AddItemPortal
						onCancel={this.handleCancelModal}
						onConfirmAdd={this.handleConfirmAdd}
					/>
				)}
			</div>
		);
	}
}

export default ContentData;
