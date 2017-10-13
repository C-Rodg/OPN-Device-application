import React from "react";
import "../styles/action-button.css";

const ActionButton = ({ icon, cb }) => {
	return (
		<div className="floating-action-button" onClick={cb}>
			<i className="material-icons">{icon}</i>
		</div>
	);
};

export default ActionButton;
