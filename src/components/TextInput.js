import React from "react";

import "../styles/input.css";

const TextInput = ({ val, tag, valChange, label, type }) => {
	return (
		<div className="input-container">
			<input
				required
				type={type ? type : "text"}
				value={val}
				onChange={ev => valChange(tag, ev)}
			/>
			<label htmlFor={label}>{label}</label>
			<div className="bar" />
		</div>
	);
};

export default TextInput;
