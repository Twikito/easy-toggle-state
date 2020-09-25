import {
	CLASS,
	CLASS_TARGET,
	CLASS_TRIGGER,
	TARGET,
	TARGET_ALL,
	TARGET_NEXT,
	TARGET_PARENT,
	TARGET_PREVIOUS,
	TARGET_SELF
} from "../constants/constants";

/**
 * Retrieve all trigger elements with a specific attribute, or all nodes in a specific scope.
 * @param {string} selector - A string that contains a selector
 * @param {node} node - An element in which to make the selection
 * @returns {array} - An array of elements
 */
export default (selector, node) => {
	const scope = selector ? `[${selector}]` : "";

	if (node) {
		return [...node.querySelectorAll(scope)];
	}

	const query = [
		`[${CLASS}]${scope}`,
		`[${CLASS_TRIGGER}]${scope}`,
		`[${CLASS_TARGET}][${TARGET}]${scope}`,
		`[${CLASS_TARGET}][${TARGET_ALL}]${scope}`,
		`[${CLASS_TARGET}][${TARGET_NEXT}]${scope}`,
		`[${CLASS_TARGET}][${TARGET_PREVIOUS}]${scope}`,
		`[${CLASS_TARGET}][${TARGET_PARENT}]${scope}`,
		`[${CLASS_TARGET}][${TARGET_SELF}]${scope}`
	]
		.join()
		.trim();

	return [...document.querySelectorAll(query)];
};
