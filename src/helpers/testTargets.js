/* Test if there's more than one target for an ID selector */
export default (selector, targetList) => {
	const regEx = /^#|^\[id=/g;

	if (targetList.length === 0) {
		console.warn(`There's no match for the selector '${selector}' for this trigger`);
	}

	if (targetList.length > 1 && regEx.exec(selector) != -1) {
		console.warn(`There's more than one target for the selector '${selector}' for this trigger`);
	}

	return targetList;
};
