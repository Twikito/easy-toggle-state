import { CLASS } from "../constants/constants";

/**
 * Retrieve all triggers with a specific attribute
 * @param  {String} selector  CSS selector (attribute)
 * @param  {Element} node     Current target for the selector
 * @return {Array}          Array<Node>
 */
export default (selector, node) => {
	const scope = selector ? `[${selector}]` : "";

	if (node) {
		return [...node.querySelectorAll(scope)];
	}

	return [...document.querySelectorAll(`[${CLASS}]${scope}`.trim())];
};
