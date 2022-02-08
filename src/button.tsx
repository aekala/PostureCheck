import React from "react";
import PropTypes from "prop-types";

function Button({ color, isSelected, handleClick }) {
	const selectedClassName: string = "current";
	let buttonElement;
	if (isSelected) {
		buttonElement = (
			<button
				style={{ backgroundColor: color }}
				className={selectedClassName}
				data-color={color}
			></button>
		);
	} else {
		buttonElement = (
			<button
				style={{ backgroundColor: color }}
				data-color={color}
				onClick={handleClick}
			></button>
		);
	}
	return <>{buttonElement}</>;
}

Button.propTypes = {
	color: PropTypes.string.isRequired,
	isSelected: PropTypes.bool.isRequired,
	handleClick: PropTypes.any.isRequired,
};

export default Button;
