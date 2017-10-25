import React, { Component } from "react";
import moment from "moment";

import { quickDateFormat } from "../utils/dateFormats";
import "../styles/data.css";
import ScanListItem from "./ScanListItem";
import DeleteItemPortal from "./DeleteItemPortal";
import AddItemPortal from "./AddItemPortal";
import ActionButton from "./ActionButton";
import Chart from "./Chart";

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
			this.props.onNotification({
				type: "success",
				message: "Successfully removed scan!",
				isShort: true
			});
		});
	};

	// Addition of scan confirmed
	handleConfirmAdd = data => {
		if (!data) {
			this.setState({ isShowingAddPortal: false, editPosition: null }, () => {
				this.props.onNotification({
					type: "error",
					message: "Unable to insert blank scan data..",
					isShort: true
				});
			});
			return false;
		}
		const scan = {
			data,
			time: moment().format(quickDateFormat),
			type: "MANUAL"
		};
		this.props.onConfirmAdd(this.state.editPosition, scan);
		this.setState({ isShowingAddPortal: false, editPosition: null }, () => {
			this.props.onNotification({
				type: "success",
				message: "New scan added!",
				isShort: true
			});
		});
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

	// Render Chart - build counts, then pass down created data object
	renderChart = () => {
		const codesObject = {};
		this.props.barcodes.forEach(code => {
			const d = moment(code.time, quickDateFormat).format("YYYY-MM-DDTHH");
			if (codesObject.hasOwnProperty(d)) {
				codesObject[d] += 1;
			} else {
				codesObject[d] = 1;
			}
		});
		const barcodeData = Object.keys(codesObject)
			.map(k => {
				return {
					id: k,
					total: codesObject[k],
					time: moment(k, "YYYY-MM-DDTHH").format("h:00 a, MMM Do"),
					percent: Math.floor(codesObject[k] / this.props.barcodes.length * 100)
				};
			})
			.sort((a, b) => {
				if (
					moment(a.id, "YYYY-MM-DDTHH").isBefore(moment(b.id, "YYYY-MM-DDTHH"))
				) {
					return -1;
				} else if (
					moment(a.id, "YYYY-MM-DDTHH").isAfter(moment(b.id, "YYYY-MM-DDTHH"))
				) {
					return 1;
				} else {
					return 0;
				}
			});
		return (
			<div className="card barcode-chart">
				<Chart title="Scan Time Summary" data={barcodeData} />
			</div>
		);
	};

	render() {
		return (
			<div className="container content-data">
				<ActionButton icon="file_upload" cb={this.props.onUploadData} />
				<div className="content-scans-list">
					<div className="pre-card-section-title">
						{this.props.barcodes && this.props.barcodes.length
							? this.props.barcodes.length
							: "0"}{" "}
						Scans:
					</div>
					<div className="scans-list-list card">{this.renderScans()}</div>
				</div>
				{this.props.barcodes &&
					this.props.barcodes.length &&
					this.renderChart()}

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
