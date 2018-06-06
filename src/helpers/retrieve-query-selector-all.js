import { CLASS } from "../constants/constants";

/**
 * Retrieve all trigger elements with a specific attribute, or all nodes in a specific scope.
 * @param {string} selector - A string that contains a selector
 * @param {node} [node] - An element in which to make the selection
 * @returns {array} - An array of elements
 */
export default (selector, node) => {
	const scope = selector ? `[${selector}]` : "";
	return node ? [...node.querySelectorAll(scope)] : [...document.querySelectorAll(`[${CLASS}]${scope}`.trim())];
};
