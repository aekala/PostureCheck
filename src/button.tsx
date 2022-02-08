import React from "react";
import PropTypes from "prop-types";

function Button({ color, isSelected }) {
	const selectedClassName: string = "current";
	let buttonElement;
	if (isSelected) {
		buttonElement = (
			<button
				style={{ backgroundColor: color }}
				className={selectedClassName}
			></button>
		);
	} else {
		buttonElement = <button style={{ backgroundColor: color }}></button>;
	}
	return <>{buttonElement}</>;
}

Button.propTypes = {
	color: PropTypes.string.isRequired,
	isSelected: PropTypes.bool.isRequired,
};

export default Button;
