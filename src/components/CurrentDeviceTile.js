import React from "react";

const CurrentDeviceTile = () => {
	return (
		<div className="current-device-tile">
			My current device...
			<div>comName (port), manufacturer(Model), Device: (quickscan/other)</div>
			<div>actions - clear, upload</div>
		</div>
	);
};

export default CurrentDeviceTile;
